# AWS Layer Metadata

Layers have no _requirement_ to export a `package.json` file nor do they need to put any particular tags in it. However, if you are authoring layers, you can do this and it gives
you a standardized way of documenting the meta data for a layer.

The only requirements are that you put a `package.json` file in the root of the layer's repo and that you add the tag `aws-layer` or `aws-layer-meta` to the tags list.

## Furthering your meta-data reach

TODO: finish