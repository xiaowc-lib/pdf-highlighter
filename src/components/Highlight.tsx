import React, { Component } from "react";

import "../style/Highlight.css";

import type { LTWHP } from "../types.js";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  comment: {
    emoji: string;
    text: string;
  };
  isScrolledTo: boolean;
  highlightColor?: string
}

export class Highlight extends Component<Props> {

  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      comment,
      isScrolledTo,
      highlightColor,
    } = this.props;

    const { rects, boundingRect } = position;
    // console.log(position, '---666666---')
    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        {comment ? (
          <div
            className="Highlight__emoji"
            style={{
              left: 20,
              top: boundingRect.top,
            }}
          >
            {comment.emoji}
          </div>
        ) : null}
        <div className="Highlight__parts" >
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              // biome-ignore lint/suspicious/noArrayIndexKey: We can use position hash at some point in future
              key={index}
              style={{ ...rect, background: highlightColor }}
              className={"Highlight__part"}

            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
