# B2NOTE Dataset View

This project contains code for UI in order to view, 
browse files and folders in connected virtual folder 
and select dataset and files and annotate them using connected B2Note API.

To continuously compile on source code changes:

`au build --watch`

To publish the build result into public github pages, 
* Enable github pages, 
* set gh-pages branch to be used. 
* launch following on after desired change was build: `./publishsite.sh`



### Recomemnded usage
This project is bootstrapped by [aurelia-cli](https://github.com/aurelia/cli).
For more information, go to https://aurelia.io/docs/cli/webpack

Recommended usage:

```
git clone https://bitbucket.org/tkulhanek/b2note-datasetview.git
cd b2note-datasetview
npm install
au build
```
In order to enable continuous build on changes during development launch:
`au build --watch`

This will produce output to `dist/` directory. Which can be mapped from apache configuration

### Run dev app

Run `au run`, then open `http://localhost:8080`

To open browser automatically, do `au run --open`.

To change dev server port, do `au run --port 8888`.

To enable Webpack Bundle Analyzer, do `au run --analyze`.

To enable hot module reload, do `au run --hmr`.

### Build for production

Run `au build --env prod`.

### Unit tests

Run `au test` (or `au jest`).

To run in watch mode, `au test --watch` or `au jest --watch`.

---

This work is co-funded by the EOSC-hub project (Horizon 2020) under Grant number 777536.

![logo](https://b2note.bsc.es/img/logo-eosc-hub-eu.png)
