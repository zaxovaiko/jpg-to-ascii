# JPG to ASCII

Converts JPG picture into ASCII symbols. The project was build with JavaScript.

![Screenshot](https://imgur.com/1rKeWS4.png)
![Screenshot](https://imgur.com/MWO7O3Q.png)

## How to run

To run this project on your own machine follow these steps:

- Clone this repository with `git clone https://github.com/zaxoavoki/jpg-to-ascii.git`
- Install all dependencies with `npm install`
- Run `npm run build` and `npm run start` or simply `npm run dev`

or check it out [here](https://jpg-to-ascii.herokuapp.com/).

## About project

### Mapping image data

I have used `jpeg-js` library to read image data. The sRGB (stardard Reg Green Blue) color space is defined in terms of the [CIE 1931](https://en.wikipedia.org/wiki/CIE_1931_color_space) linear luminance Y<sub>lin</sub>, which is given by:

Y<sub>lin</sub> = 0.2126 *R<sub>lin</sub> + 0.7152* G<sub>lin</sub> + 0.0722 * B<sub>lin</sub>

After mapping each pixel to grayscale with this formula (e.g. `rgba(255, 255, 255, 0) => 254.998`) I have replaced given value with most suitable one in `ascii_map.json`.

#### Resizing image

To make an image smaller I have used an algorithm that just removes every second row or column (depends on what we resize - height or width).

To get number of squeeze times I used tricky formula `2^x = width / 170px`.

## To-do

- [ ] Add extended ASCII map
- [ ] Add support for other image formats
