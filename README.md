# geocodes

*A tool to get ISO codes and geometries from country names*

## Installation

#### <ins>In browser</ins>

```html
<script src="https://cdn.jsdelivr.net/npm/geocountries" charset="utf-8"></script>
```

#### <ins>In Observable</ins>

~~~js
geocountries = require("geocountries")
~~~

## Documentation

Domumentation and running examples available [here](https://observablehq.com/@neocartocnrs/geocountries).

## Features

#### <ins>getcode</ins>

To get an ISO3 code from a country name.

~~~js
geocountries.getcode("United States of America")
~~~

returns an object

~~~js
{name: "United States of America", iso3: "USA", score: 1}
~~~

#### <ins>iso3</ins>

To get ISO3 codes from a json data set.

~~~js
codes = geocountries.iso3({
  json: fao,
  name: "Area",
  threshold: 0.7
})
~~~

returns a Map

~~~js
{
  "Afghanistan" => Object {name: "Afghanistan", iso3: "AFG", score: 1}
  "Albania" => Object {name: "Albania", iso3: "ALB", score: 1}
  "Algeria" => Object {name: "Algeria", iso3: "DZA", score: 1}
}
~~~

#### <ins>view</ins>

To visualize the matching of codes and names.

~~~js
geocountries.view(codes)
~~~

returns a svg chart

![](./img/geocountries.png)

#### <ins>add</ins>

To add the codes to the initial dataset

~~~js
data = geocountries.add({ data: mydata, codes: codes, name: "Area" })
~~~
