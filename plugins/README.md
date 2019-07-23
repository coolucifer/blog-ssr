# PLUGINS

**This directory is not required, you can delete it if you don't want to use it.**

This directory contains Javascript plugins that you want to run before mounting the root Vue.js application.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/plugins).

## Socket.io
Here is a list of evnets:  
on:  
- connect
- join, leave
> { userId, clients }
- receive
> { type, from, msg }

emit:  
- online-list
> { list }
- message
> { type, to, msg }