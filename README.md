# Fancy Index

A responsive Apache index page.

I was tired of seeing the ugly apache-generated index page, so I decided to do something about it. Inspired by [Seti UI](https://github.com/jesseweed/seti-ui), this project adds an `.htaccess` file which tells apache to use a table, among other things, instead of `<pre>`.

### Before Fancy Index:
![before fancy index](before.png)

### After Fancy Index
![after fancy index](after.png)


## Setup

I'm going to assume you're using a `Sites` folder with apache, but it could be done differently. Wherever you see `USERNAME`, use your username.

1. Clone or download the files.
2. Add them to your `Sites` directory. The structure should be `/Users/USERNAME/Sites/fancy-index`.
3. Copy the `.htaccess` file up one directory to `/Users/USERNAME/Sites/.htaccess`.
4. Update your `DocumentRoot` in `/etc/apache2/USERNAME.conf` to point to your `Sites`. This will also cause `localhost` to point to `Sites` and you won't have to use the `~USERNAME` to access it.

This is what mine looks like:
```apache
DocumentRoot "/Users/glen.cheney/Sites"

<Directory "/Users/glen.cheney/Sites">
    AllowOverride All
    Options Indexes MultiViews FollowSymLinks
    Require all granted
</Directory>

```

Now restart apache `sudo apachectl restart`.
