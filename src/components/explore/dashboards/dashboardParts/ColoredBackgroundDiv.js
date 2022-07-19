/**
 * Create a div with a color overlay.
 * This can be used with a transparent color to for instance darken a background
 * @returns
 */
const ColoredBackgroundDiv = ({ children, color, background = null, style = {} }) => {
  // just wrap the children in this component, pass an image path to background and a string to color
  return (
    <>
      <div
        style={{
          zIndex: 1,
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          background: color,
          position: "absolute",
        }}
      />
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          backgroundImage: background ? `url(${background})` : "none",
          backgroundSize: "100vw 100vh",
          ...style,
        }}
      >
        <div style={{ zIndex: 2, width: "100%" }}>{children}</div>
      </div>
    </>
  );
};

export default ColoredBackgroundDiv;
