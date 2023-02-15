## Webcomponent Image comparison slider

### Overview
A simple Image comparison slider where one can compare two images by moving the comparison bar along the x-Axis of the image container. The project is implemented using HTML, CSS and some JavaScript (Resize Obersver and Control of the slider position). I decided to build this project with normal HTML and as a Webcomponent with a custom element `<img-comparison>`.
In order to make things responsive, the image container div has a max-width and uses custom properties for the width and height. The width and height properties are updated by a Resize Observer and control the sizing of the images inside the container (they should both have the same dimensions as the image container).

### Webcomponent info
The Webcomponent version of the image comparison slider uses the Custom Elements API together with the Shadow DOM API and thus encapsulates the HTML markup and CSS Styling for the image comparison slider. It uses the same setup as the normal HTML version but inside an extension class of an HTML-Element. By supplying the `data-image1` and `data-image2` attributes to the custom element, one can set the sources for the two images.