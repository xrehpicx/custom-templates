# Automate copy pasting ur boilerplate code

## Get started

### installation:
```
$ npm install -g custom-templates
```

## setup
run command:
```
$ ct
```
and select a folder where u save your templates.
For example:
```
/templates
    /react-cra-template1
    /react-cra-template2
    /express-react-template
    /express-typescript
    /express-typescriptv4.1
    /custom-cra-template
```
select ut templates folder here as 'templates'

## Usage
1. with only new project name, run:
```
$ ct mynewapp
```
this will prompt you to select a template from ur templates folder.

2. if you are already in your project folder:
```
$ ct
```
this will prompt you to select a template from ur templates folder.

if you dont want it to prompt you u can use the flag -t or --template and specify the name of ur template, example:
```
$ ct -t custom-cra-template mynewapp
```
or 
```
$ ct -t custom-cra-template
```
if you are already in your project dir
