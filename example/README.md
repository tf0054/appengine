Appenginejs Example
===================

A simple Guestbook as an example of a JSGI Web Application powered by appenginejs.


Quick start
===========

Setup the application:

    $ export APPENGINE_JAVA_SDK=/path/to/appengine/sdk
    
Create symbolic links to the required narwhal packages:
    
    $ cd war/WEB-INF/packages
    $ ln -s /path/to/narwhal .
    $ ln -s /path/to/jack .
    $ ln -s /path/to/appengine .

Start the dev server:

    $ ant runserver

and browse to http://localhost:8080/


Deploy to App Engine
====================

To deploy to App Engine:

    $ /path/to/appengine/sdk/bin/appcfg.sh --email=your.email@account.com update war/

Before deploying you may want to remove excess files from packages. You need to *keep* the following files:

    example/war/WEB-INF/packages/appengine/lib
    example/war/WEB-INF/packages/appengine/package.json
    example/war/WEB-INF/packages/jack/lib
    example/war/WEB-INF/packages/jack/package.json
    example/war/WEB-INF/packages/narwhal/engines/default
    example/war/WEB-INF/packages/narwhal/engines/rhino
    example/war/WEB-INF/packages/narwhal/lib
    example/war/WEB-INF/packages/narwhal/local.json
    example/war/WEB-INF/packages/narwhal/narwhal.conf
    example/war/WEB-INF/packages/narwhal/narwhal.js
    example/war/WEB-INF/packages/narwhal/package.json


Support
=======

For questions regarding this example or appenginejs please post to the mailing list: [http://groups.google.com/group/appenginejs](http://groups.google.com/group/appenginejs)