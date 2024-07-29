import React from "react";
import type { IHighlight } from "./react-pdf-highlighter";
import { Card } from 'antd';
import {
  DeleteOutlined
} from '@ant-design/icons';

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  clickCb?: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

declare const APP_VERSION: string;

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  clickCb,
}: Props) {
  const delhighlight = (event: any, highlight: any) => {
    console.log(highlight, '444444')
    event.stopPropagation();

  }
  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      {/* <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          react-pdf-highlighter {APP_VERSION}
        </h2>

        <p style={{ fontSize: "0.7rem" }}>
          <a href="https://github.com/agentcooper/react-pdf-highlighter">
            Open in GitHub
          </a>
        </p>

        <p>
          <small>
            To create area highlight hold ⌥ Option key (Alt), then click and
            drag.
          </small>
        </p>
      </div> */}
      <div className="comment-head">
        <span>批注列表 <span className="count">（{(highlights.length || 0) + '条'}）</span></span>
      </div>

      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: This is an example app
            key={index}
            className="sidebar__highlight"
            onClick={() => {
              clickCb?.()
              updateHash(highlight);
            }}
          >
            <Card>
              <div>
                <div className="delete-icon" onClick={(e: any) => { delhighlight(e, highlight) }}>
                  <DeleteOutlined />
                </div>
                <strong>{index + 1}. {highlight.comment.text}</strong>
                {highlight.content.text ? (
                  <blockquote style={{ marginTop: "0.5rem" }}>
                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                  </blockquote>
                ) : null}
                {highlight.content.image ? (
                  <div
                    className="highlight__image"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <img src={highlight.content.image} alt={"Screenshot"} />
                  </div>
                ) : null}
              </div>
              <div className="highlight__location">
                <span>批注者：xxx666</span>
                <span>页码：{highlight.position.pageNumber}</span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <div style={{ padding: "1rem" }}>
        <button type="button" onClick={toggleDocument}>
          Toggle PDF document
        </button>
      </div>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button type="button" onClick={resetHighlights}>
            Reset highlights
          </button>
        </div>
      ) : null}
    </div>
  );
}
