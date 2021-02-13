## Backend generated heatmap

Mouse-move event's `x` & `y` are sent over via Websocket connection to the server where a cursor heatmap is generated in the form of a `png` img

Other heatmap solutions tend to generate a large object of cursor coordinates on the client side - this is more of an event-driven approach with all computations made on the BE.

Unfortunately, the current canvas implementation on the BE does not support canvas context filters and I'm not up for polyfilling that in that task :|
