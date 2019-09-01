//
// -- IRIS Toolkit - Set of useful utilities for NodeJs
//
//  Copyright (c) 2011-2014 ASPECTRON Inc.
//  All Rights Reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
// 
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
// 
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

var fs = require('fs');
var os = require('os');
var child_process = require("child_process");
var spawn = child_process.spawn;
var exec = child_process.exec;
var colors = require('colors');
var _ = require('underscore');
var path = require('path');

var hostname = os.hostname();

global.dpc = function(t,fn) { if(typeof(t) == 'function') setTimeout(t,0); else setTimeout(fn,t); }

var UTILS = { }

UTILS.render = function(text, font, callback) {

    if(!UTILS.art){
        UTILS.art = require('iris-ascii-art');
        UTILS.__oldFontPath = UTILS.art.fontPath;
        if (UTILS.art.Figlet){
            UTILS.__oldFontPath = UTILS.art.Figlet.fontPath;
        }
    }

    
    UTILS.setFontPath(__dirname+"/");

    UTILS.art.font(text, font || 'cybermedium', '', function(rendered) {

        UTILS.setFontPath(UTILS.__oldFontPath);

        if(callback)
            return callback(null, rendered);
        else
            console.log('\n'+rendered);
    });
}

UTILS.setFontPath = function(path){
    if (UTILS.art.Figlet){
        UTILS.art.Figlet.fontPath = path;
    }else{
        UTILS.art.fontPath = path;
    }
}

UTILS.get_ts = Date.now;

UTILS.ts_string = UTILS.tsString = function(src_date) {
    var a = src_date || (new Date());
    var year = a.getFullYear();
    var month = a.getMonth()+1; month = month < 10 ? '0' + month : month;
    var date = a.getDate(); date = date < 10 ? '0' + date : date;
    var hour = a.getHours(); hour = hour < 10 ? '0' + hour : hour;
    var min = a.getMinutes(); min = min < 10 ? '0' + min : min;
    var sec = a.getSeconds(); sec = sec < 10 ? '0' + sec : sec;
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;
}


UTILS.readJSON = function(filename) {
    if(!fs.existsSync(filename))
        return undefined;
    var text = fs.readFileSync(filename, { encoding : 'utf-8' });
    if(!text)
        return undefined;
    try { 
        return JSON.parse(text); 
    } catch(ex) { 
        console.log(ex.trace); 
        console.log('Offensing content follows:',text); 
    }
    return undefined;
}

UTILS.writeJSON = function(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data));
}


UTILS.get_config = UTILS.getConfig = function(name) {

    var host_filename = __dirname + '/../../config/'+name+'.'+hostname+'.conf';
    var filename = __dirname + '/../../config/'+name+'.conf';

    var data = undefined;

    if(fs.existsSync(host_filename)) {
        data = fs.readFileSync(host_filename);
        console.log("Reading config:",host_filename);
    }
    else
    {
        data = fs.readFileSync(filename);
        console.log("Reading config:",filename);
    }

//  console.log(data.toString('utf-8'));
    return eval('('+data.toString('utf-8')+')');
}


UTILS.get_ssl_options = function() {
    var ssl_options = {
        key : fs.readFileSync(__dirname + '/../../config/ssl/key.pem').toString(),
        cert : fs.readFileSync(__dirname + '/../../config/ssl/certificate.pem').toString(),
    }
    return ssl_options;
}


UTILS.bind_database_config = UTILS.bindDatabaseConfig = function(db, _config_list, callback) {
    var o = { _database : db }
    var config_list = _config_list.slice();

    bind_collection();

    function bind_collection() {
        var config = config_list.shift();
        if(!config)
            return callback(null, o);

        db.collection(config.collection, function(err, collection) {
            if(err)
                return callback(err);

            o[config.collection] = collection;

            if(config.indexes) {
                var indexes = config.indexes.split('|');

                bind_indexes(collection, indexes, function(err) {
                    if(err)
                        return callback(err);
                    bind_collection();
                });
            }
            else
                bind_collection();
        })
    }

    function bind_indexes(collection, indexes, callback) {

        bind_index();

        function bind_index() {
            var index = indexes.shift();
            if(!index)
                return callback();

            index = index.split('->');

            var args = [ ]
            var index_name = { }
            var names = index.shift();
            _.each(names.split('&'), function(name) {
                if(name && name.length)
                    index_name[name] = 1;
            })
            args.push(index_name);

            var options = { }
            var arg = index.shift();
            while(arg) {

                arg = arg.split(':');
                if(arg.length == 1)
                    arg.push(true);

                if(arg[1] == 'true')
                    arg[1] = true;
                else
                if(arg[1] == 'false')
                    arg[1] = false;

                options[arg[0]] = arg[1];

                arg = index.shift();
            }
            args.push(options);
            args.push(function(err) {
                if(err)
                    return callback(err);
                bind_index();
            })

            collection.ensureIndex.apply(collection, args);
        }
    }
}


UTILS.MAX_LOG_FILE_SIZE = 50 * 1014 * 1024
UTILS.Logger = function(options) {
    var self = this;
    var file = options.filename;

    var logIntervalTime = options.logIntervalTime || 24 * 60 * 60;
    var logFilesCount   = options.logFilesCount || 7;
    var newFile     = '';
    var fileDate    = new Date();
    var folderPath  = '';

    buildNewFileName();

    var flag = false;
    self.write = function(text) {
        if( flag ){
            flag = false;
            copyFile(function(){
                writeLog(text);
            });
            return;
        }
        writeLog(text);
    }

    var d = new Date();

    if (options.testingMode){
        d.setSeconds(d.getSeconds()+20);
    }else{
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
    }

    var d2      = new Date();
    var diff    = d.getTime()-d2.getTime();
    var fullDayMilliSeconds = 24 * 60 * 60 * 1000;
    if (diff < 0) {
        diff = fullDayMilliSeconds + diff;
    };

    setTimeout(function(){
        console.log('log-rotation started.'.red.bold, new Date());
        flag        = true;
        setInterval(function(){
            flag        = true;
        }, logIntervalTime * 1000);
    }, diff)

    function writeLog(text){
        try {
            fs.appendFileSync(file, text);
        } catch(ex) { console.log("Logger unable to append to log file:", file); }
    }

    function buildNewFileName(){
        var parts = file.split('/');
        var filename = parts.pop();
        var ext = filename.split('.');
        if (ext.length > 1) {
            ext = '.'+ext[ext.length-1];
        }else{
            ext = '';
        }
        folderPath = parts.join('/');

        newFile = 'L-$$$'+ext;
    }

    function copyFile(callback){
        fs.readFile(file, function(err, data){
            if (err)
                return callback();

            var fName = newFile.replace('$$$', UTILS.ts_string(fileDate).replace(/:/g, '-').replace(" ", "_") );
            fs.writeFile( path.join(folderPath, '/', fName), data, function(err, success){
                if (err)
                    return callback();

                fileDate    = new Date();
                fs.writeFile(file, '', function(){
                    callback();

                    var cmd = 'gzip "'+fName+'"';
                    exec(cmd, {cwd: folderPath}, function (error, stdout, sterr) {
                        console.log('GZIP EXEC'.green, "CMD:", cmd, "RESULT:", arguments)
                        removeOldLogs();
                    });
                });
            });
        });
    }

    function removeOldLogs(){
        var files = [];
        function done(a){
            var fLength = files.length;
            if ( fLength <= logFilesCount)
                return;

            files = _.sortBy(files, function(c){ return c.t;});
            for(var i = 0; i < (fLength - logFilesCount); i++){
                fs.unlinkSync(files[i].file);
            }
        }

        fs.readdir(folderPath, function(err, list) {
            if (err)
                return done(err);

            var pending = list.length;
            if (!pending)
                return done();

            list.forEach(function(file) {
                if (file.indexOf('L-')!==0){
                    if (!--pending)
                        done();
                    return;
                }

                file = folderPath + '/' + file;
                fs.stat(file, function(err, stat) {
                    if (stat) {
                        files.push({file: file, t: stat.ctime.getTime()})
                    }
                    if (!--pending)
                        done();
                });
            });
        });
    }
}

UTILS.Process = function(options) {
    var self = this;
    self.options = options;
    self.relaunch = true;

    if(!options.descr)
        throw new Error("descr option is required");

    self.terminate = function() {
        if(self.process) {
            self.relaunch = false;
            self.process.kill('SIGTERM');
            delete self.process;
        }
        else
            console.error("Unable to terminate process, no process present");
    }

    self.restart = function() {
        if(self.process) {
            self.process.kill('SIGTERM');
        }
    }

    self.run = function() {
        if(self.process) {
            console.error(self.options);
            throw new Error("Process is already running!");
        }

        self.relaunch = true;
        self.process = spawn(self.options.process, self.options.args, { cwd : self.options.cwd });

        if(0) {
            self.process.stdout.pipe(process.stdout);
            self.process.stderr.pipe(process.stderr);
            self.stdin = process.openStdin();
            self.stdin.pipe(self.process.stdin);
        }
        else {
            self.process.stdout.on('data',function (data) {
                process.stdout.write(data);
                if(options.logger)
                    options.logger.write(data);
            });

            self.process.stderr.on('data',function (data) {
                process.stderr.write(data);
                if(options.logger)
                    options.logger.write(data);
            });

            self.stdin = process.openStdin();
            self.stdin.on('data', function(data) {
                self.process.stdin.write(data);
            });
        }

        self.process.on('exit',function (code) {
            if(code)
                console.log("WARNING - Child process '"+self.options.descr.toUpperCase()+"' exited with code "+code);
            delete self.process;
            if(self.relaunch) {
                console.log("Restarting '"+self.options.descr.toUpperCase()+"'");
                dpc(options.restart_delay || 0, function() {
                    if(self.relaunch)
                        self.run();
                });
            }
        });
    }
}


UTILS.bytes_to_size = UTILS.bytesToSize = function(bytes, precision)
{
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var posttxt = 0;
    if (bytes == 0) return 'n/a';
    while (bytes >= 1024)
    {
        posttxt++;
        bytes = bytes / 1024;
    }
    return bytes.toFixed(precision || 2) + sizes[posttxt];
}

// http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
UTILS.get_v4_ips = (function () {
    var ignoreRE = /^(127\.0\.0\.1|::1|fe80(:1)?::1(%.*)?)$/i;

    var cached;
    var command;
    var filterRE;

    switch (process.platform) {
    case 'win32':
    case 'win64':
        command = 'ipconfig';
        filterRE = /\bIPv4[^:\r\n]+:\s*([^\s]+)/g;
        break;
    case 'darwin':
        command = 'ifconfig';
        filterRE = /\binet\s+([^\s]+)/g;
        break;
    default:
        command = 'ifconfig';
        filterRE = /\binet\b[^:]+:\s*([^\s]+)/g;
        break;
    }

    return function (callback, bypassCache) {
        if (cached && !bypassCache) {
            callback(null, cached);
            return;
        }
        // system call
        exec(command, function (error, stdout, sterr) {
            cached = [];
            var ip;

            var matches = stdout.match(filterRE) || [];
            if (!error) {
                for (var i = 0; i < matches.length; i++) {
                    ip = matches[i].replace(filterRE, '$1')
                    if (!ignoreRE.test(ip)) {
                        cached.push(ip);
                    }
                }
            }
            callback(error, cached);
        });
    };
})();

UTILS.get_client_ip = UTILS.getClientIp = function(req) {
  var ipAddress;
  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};


// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
UTILS.walk_directory = UTILS.walkDirectory = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};


UTILS.init_http_modules = function(core, root_app, module_list, module_config, callback) {

    if(!UTILS.express)
        UTILS.express = require('express');

    var modules = { }
    var module_apps = [ ]
    var module_names = [ ]
    _.each(module_list, function(name) {
        var constructor = require('../../'+name);
        var module_app = UTILS.express();
//            console.log("LOADING MODULE:",name,"WITH CONFIG:",config[name]);
        modules[name] = new constructor(core, module_config ? module_config[name] : null);
        module_names.push(name);
        // module_objects.push(module);

        module_apps.push({ name : name, root : modules[name].root, app : modules[name].app });
    })

    // sort http paths so that / goes last to prevent path interference (since everything matches /)
    module_apps.sort(function(a,b) { if(a.root == '/') return 1; return -1; })

// console.log(module_apps);

    _.each(module_apps, function(module) {
        root_app.use(module.root, module.app);
         // console.log("binding:",module.root);
    })

    init_module();

    function init_module() {
        var name = module_names.shift();
        if(!name)
            return callback();
        var module = modules[name]

        // console.log('Loading module: '+name.bold);

        module.init(function(err){
            if(err)
                console.log(err);
            init_module();
        })
    }
}

UTILS.http_request = function(options, callback)
{    
    if(!UTILS.http)
        UTILS.http = require('http');

    if(!UTILS.https)
        UTILS.https = require('https');

    http_handler = options.https ? UTILS.https : UTILS.http;
    var req = http_handler.request(options, function(res) {
        res.setEncoding('utf8');
        var result = '';
        res.on('data', function (data) {
        result += data;
        });
        res.on('end', function () {
            callback(null, result);
        });
    });

    req.on('error', function(e) {
        callback(e);
    });

    if(options.post_data)    
        req.write(options.post_data);

    req.end();
}

UTILS.GET_CONFIG_RETRY_INTERVAL = 3000;
UTILS.GET_CONFIG_RETRIES = 10;
UTILS.GET_CONFIG_FILENAME = 'remote-config.json';

UTILS.get_config_ex = function(options, callback) { 

    if(!options.name)
        throw new Error("missing options.name");

    if(!options.identifier)
        throw new Error("missing options.identifier");

    var config = UTILS.get_config(options.name);

    if(config.redirect) {

        var url = URL.parse(config.redirect);
        var path = url.path;
        if(path[path.length-1] != '/')
            path += '/';
        path += options.identifier;

        var opt = {
            host : url.hostname,
            port : url.port,
            path : path,
            method : 'GET',
            https : url.protocol == 'https:' ? true : false
        }

        if(options.auth)
            opt.auth = options.auth.user+':'+options.auth.pass;

        console.log("Getting config at "+url.protocol+"//"+url.hostname+":"+url.port+path);

        var retries = 0;

        do_request();
        function do_request() {

            if(retries >= UTILS.GET_CONFIG_RETRIES) {

                if(fs.existsSync(UTILS.GET_CONFIG_FILENAME)) {
                    data = fs.readFileSync(UTILS.GET_CONFIG_FILENAME);
                    var o = eval('('+data.toString('utf-8')+')');
                    _.extend(config, o);
                }

                return callback(null, config);
            }

            zutils.http_request(opt, function(err, text) {

                if(err) {
                    console.error(("Error getting config at "+url.protocol+"//"+url.hostname+":"+url.port+path).red.bold);
                    console.error(err.toString().red.bold);
                    retries++;
                    return dpc(UTILS.GET_CONFIG_RETRY_INTERVAL, do_request);
                }
                try {
                    var o = JSON.parse(text);
                } catch(e) {
                    console.error(e);
                    retries++;
                    return dpc(UTILS.GET_CONFIG_RETRY_INTERVAL, do_request);
                }

                fs.writeFileSync(UTILS.GET_CONFIG_FILENAME, JSON.stringify(o,null,' '));

                _.extend(config, o);
                callback(null, config);
            })
        }
    }
    else {
        callback(null, config);
    }
}

UTILS.secure_under_username = function(username) {
    if(process.platform != 'win32') {
        try {
            exec('id -u '+username, function(err, stdout, stderr) {
                if(!err) {
                    var uid = parseInt(stdout);
                    if(uid) {
                        console.log('Setting process UID to:',uid);
                        process.setuid(uid);
                    }
                }
            });
        } catch(ex) {
            console.error(ex);
        }
    }
}

UTILS.paginate = function(args, collection, callback) {

    var limit = parseInt(args.limit) || 0;
    var skip = parseInt(args.start); 

    var query = args.query || { }

    _.each(query, function(v,k) {
        if(v == 'true')
            query[k] = true;
        else
        if(v == 'false')
            query[k] = false;
    })

    var sort = { }
    if(args.sort) {
        _.each(args.sort, function(direction, property) {
            sort[property] = direction == 'DESC' ? -1 : 1;
        });
    }

    collection.find(query, function(err, cursor) {
        if(err) 
            return callback(err);
        cursor.count(function(err, count) {
            cursor.sort(sort).limit(limit).skip(skip).toArray(function(err, records) {
                if(err) 
                    return callback(err);
                callback(null, {
                    records : records,
                    count : count
                })
            })
        })
    })
}

UTILS.Steps = function() {
    var self = this;
    self.steps = [ ]

    self.push = function(fn) {
        self.steps.push(fn);
    }

    self.run = function(callback) {
        run_step();
        function run_step() {
            var step = self.steps.shift();
            if(!step)
                return callback();

            step.call(this, function(err) {
                if(err)
                    return callback(err);
                run_step();
            });
        }
    }
}

module.exports = UTILS;