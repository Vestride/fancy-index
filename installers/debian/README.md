# Debian installer
## TL; DR
```
curl https://raw.githubusercontent.com/Vestride/fancy-index/main/installers/debian/fancy-apache.sh -o fancy-apache.sh; sudo bash fancy-apache.sh
```
And follow the instructions on the terminal.

## Obtaining the installer
This installer sets up fancy-index automatically for your apache VHosts. You can run the installer by executing the following command:
```
curl https://raw.githubusercontent.com/Vestride/fancy-index/main/installers/debian/fancy-apache.sh -o fancy-apache.sh; sudo bash fancy-apache.sh
```
If the command fails make sure that you have `curl` installed or dowload the script manually and execute:
```
sudo bash fancy-index.sh
```
## Using the installer
First of all you will be asked the folder where you want to install fancy-index:
```
Fancy index installation folder (default:'/var/www/fancy-index'):
```
Then the last version of fancy index will be cloned from github. You should see something similar to this:
```
Obtaining files from https://github.com/Vestride/fancy-index...
Obtained files successfully!
Fancy-index is up to date!
```
If the process fails be sure you have internet connection.
Afterwards you will need to input your apache installation folder:
```
Apache2 installation folder (default:'/etc/apache2'):
```
You can leave it blank if you use the default apache2 installation folder.
Finally you will be asked to specifiy which config file must be configured. Here you will see a list of all you pages, just specify the number of the one you want to configure.
```
Valid apache installation folder: /etc/apache2
===========================================================
 [0]: 000-default.conf
 [1]: default-ssl.conf
===========================================================
Select the page to be configured (the number between []):
```
If everything goes okay you will see the following output:
```
Starting configuration process for: /etc/apache2/sites-available/000-default.conf...
Successfully extracted DocumentRoot instruction.
\----> Source: /etc/apache2/sites-available/000-default.conf
 \---> Value:  /var/www/html
Going up one directory to /var/www...

File collision check pass!
Copying required files...
Enabling required modules...
```
Finally specify if you want to restart the apache server now or you will do it manually later:
```
Do you want to restart the Apache2 server now? [Y/N]
```
