# Buildless JSX
## Create an interactive Colab cell with JSX ##

Now you can use a framework like React or Preact in your Colab notebook.  Just
add Buildless JSX to the bottom of the cell!

## How to use ##

Paste this cell into your notebook:

```html
%%html
<script type = "importmap">
  {
    "imports": {
      "preact": "https://esm.sh/*preact@10.8.2"
    }
  }
</script>
<script>window.onerror = () => true // silence initial JSX parse error</script>
<script type = "module">
  window.onerror = undefined;

  import {
    createElement,
    render,
  } from 'preact';

  const root = document.getElementById('output-body');

  render(
    <div>
      This &lt;div /&gt; was rendered with JSX!
    </div>,
    root
  );
</script>

<script type = "module" src = "https://esm.sh/buildless-jsx"></script>
```

## How it works ##

Buildless JSX scans all the `<script>` tags in the cell for JSX markers `</` and
`/>`.  If it finds one, it converts all the JSX in that cell to use the factory
`createElement`.

It's the same philosophy as `@babel/standalone`, but it works in a notebook with
zero configuration.  We use it in Colab, but it should work in any cell that
renders HTML, e.g Jupyter/IPython.  Buildless JSX currently uses `tsc` for
transpilation.

Buildless JSX is focused on making JSX usable in a notebook.  It doesn't watch
the DOM for new `<script>` tags.  It doesn't expose hooks to configure or swap
out the transpilation engine.  It doesn't let you change the name of the JSX
factory.

Because it must live in every cell, the import statement is whittled down to a
single line.

### Syntax highlighting ###

Colab only provides JavaScript syntax highlighting when `type` is set to a
recognized value like `module`.  However, this means that the browser will also
try to excute these tags, before Buildless JSX has had a chance to process them.

Luckily, the JSX markers `</`and `/>` are not valid JavaScript.  The browser
cannot parse them, so we don't need to worry about the code being run twice.
However, the browser will throw a parse error when it encounters a `<script>`
tag with unprocessed JSX.

We can suppress this error with a bit of cleverness.  Before your JSX
`<script>` tag, add this line:

```html
<script>window.onerror = () => true // silence initial JSX parse error</script>
```

Then at the beginning of your JSX `<script>` tag, add this one:

```javascript
window.onerror = undefined;
```

This will prevent errors from being written to the console while the invalid
JavaScript is in the DOM.  As soon a Buildless JSX converts the tag to valid
JavaScript, the second line will run, and the global error handler will be
re-enabled.

## Addendum ##

**This is not an officially supported Google product.**  While we do use it
internally, open-source support is provided on a best-effort basis.

## License ##

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
