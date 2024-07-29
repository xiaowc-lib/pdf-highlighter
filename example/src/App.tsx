import React, { Component } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfHighlighterRead,
  PdfLoader,
  Popup,
  Tip,
  CommonPdf,
} from "./react-pdf-highlighter";


import type {
  Content,
  IHighlight,
  NewHighlight,
  ScaledPosition,
} from "./react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import { testHighlights as _testHighlights } from "./test-highlights";

import "./style/App.css";

// import testPdf from 'test.pdf'

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
  url: string;
  highlights: Array<IHighlight> | any;
  leftHighlights: Array<IHighlight> | any;
  rightHighlights: Array<IHighlight> | any;
  curHighlight: any;
  curFlag: string
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";
// const PRIMARY_PDF_URL = `${import.meta.env.BASE_URL}test.pdf`;
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;


const testLights = [
  {
    id: "1234567878",
    position: {
      boundingRect: {
        // x1: 188.623,
        // y1: 420.803,
        // x2: 255.729,
        // y2: 429.978,
        // width: 809.9999999999999,
        // height: 1200,
        x2: 248.623,
        y2: 544.803,
        x1: 335.729,
        y1: 565.978,
        width: 809.9999999999999,
        height: 1200,
        // width: 965,
        // height: 1248
      },
      rects: [
        {
          // x1: 188.623, +60
          // y1: 420.803, +124
          // x2: 255.729, +80
          // y2: 429.978, +136
          // width: 809.9999999999999,
          // height: 1200,

          x1: 188.623,
          y1: 420.803,
          x2: 255.729,
          y2: 429.978,

          // x2: 248.623,
          // y2: 544.803,
          // x1: 335.729,
          // y1: 565.978,
          width: 809.9999999999999,
          height: 1200,
        }

      ],
      pageNumber: 1
    },
    content: {
      text: "Type Checking for JavaScript",
    },
    comment: {
      text: "66666666",
      emoji: "",
    }
  },

  {
    id: "12345678780",
    position: {
      boundingRect: {
        // 98.8813, 299.693, 513.118, 324.965
        // 304.79,324.57,
        x1: 98.8813,
        y1: 299.693,
        x2: 513.118,
        y2: 324.965,
        width: 809.9999999999999,
        height: 1200,
        // x1: 158.8813,
        // y1: 423.693,
        // x2: 593.118,
        // y2: 460.965,
        // width: 809.9999999999999,
        // height: 1200,

      },
      rects: [


        // x1: 98.8813, +60 
        // y1: 299.693, +124 
        // x2: 513.118, +80
        // y2: 324.965, +136
        // width: 809.9999999999999,
        // height: 1200,
        {

          x1: 158.8813,
          y1: 423.693,
          x2: 593.118,
          y2: 460.965,
          width: 809.9999999999999,
          height: 1200,
        }


      ],
      pageNumber: 1
    },
    content: {
      text: "Type Checking for JavaScript",
    },
    comment: {
      text: "8888888888",
      emoji: "",
    }
  },

  {
    id: "12345678789",
    position: {
      boundingRect: {
        // 301.765, 253.43, 434.918, 262.496

        // x1:  301.765,
        // y1: 253.43,
        // x2: 513.118,
        // y2: 324.965,
        // width: 809.9999999999999,
        // height: 1200,

        x1: 361.765,
        y1: 377.43,
        x2: 593.118,
        y2: 460.965,
        width: 809.9999999999999,
        height: 1200,




      },
      rects: [
        {
          //   x1: 98.8813, +60 
          // y1: 299.693, +124 
          // x2: 513.118, +80
          // y2: 324.965, +136
          // width: 809.9999999999999,
          // height: 1200,
          x1: 361.765,
          y1: 377.43,
          x2: 593.118,
          y2: 460.965,
          width: 809.9999999999999,
          height: 1200,


        }

      ],
      pageNumber: 1
    },
    content: {
      text: "Type Checking for JavaScript",
    },
    comment: {
      text: "999999999",
      emoji: "",
    }
  },
  {
    id: '123',
    content: { text: "transfer to downstream tasks" },
    position: {
      boundingRect:
      {
        x1: 472.72308349609375,
        y1: 628.265625,
        x2: 687.7262573242188,
        y2: 650.265625,
        width: 973.9999999999999,
        height: 1260.4705882352941
      },
      rects: [
        {
          x1: 472.72308349609375,
          y1: 628.265625,
          x2: 687.7262573242188,
          y2: 650.265625,
          width: 973.9999999999999,
          height: 1260.4705882352941
        }],
      pageNumber: 1
    },
    comment: { text: '66666', emoji: "" }
  }

]
// biome-ignore lint/complexity/noBannedTypes: Not sure what to use instead of {}
class App extends Component<{}, State> {
  highlightColor: string = '#bcd2ee'
  state = {
    url: initialUrl,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : [],
    // highlights: testLights
    //   ? testLights
    //   : [],
    leftHighlights: testHighlights[PRIMARY_PDF_URL],
    rightHighlights: testHighlights[SECONDARY_PDF_URL],
    curHighlight: null,
    curFlag: '',

  };

  setCurFlagFn = (curFlag: string) => {
    this.setState({
      curFlag
    })
  }



  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  scrollViewerTo = (highlight: IHighlight) => { };
  scrollViewerToSub = (highlight: IHighlight) => { };

  scrollToHighlightFromHash = () => {
    const { leftHighlights } = this.state
    const highlight = this.getHighlightById(parseIdFromHash(), leftHighlights);
    console.log(highlight, '99999')
    this.setState({
      curHighlight: highlight
    })

    if (highlight) {
      this.scrollViewerTo(highlight);
      this.scrollViewerToSub(highlight);
    }

  };

  scrollToHighlightFromHashSub = () => {
    const { rightHighlights } = this.state
    const highlight = this.getHighlightById(parseIdFromHash(), rightHighlights);
    this.setState({
      curHighlight: highlight
    })
    console.log(highlight, 'sub')
    if (highlight) {
      this.scrollViewerToSub(highlight);
      this.scrollViewerTo(highlight);
    }

  };

  // bindHashChangeFn = (flag: string) => {
  //   const { curFlag } = this.state
  //   window.removeEventListener('hashchange',)

  //   window.addEventListener(
  //     "hashchange",
  //     curFlag === 'left' ? this.scrollToHighlightFromHash : this.scrollToHighlightFromHashSub,
  //     false,
  //   );
  // }

  componentDidMount() {
    const { curFlag } = this.state
    window.addEventListener(
      "hashchange",
      curFlag === 'left' ? this.scrollToHighlightFromHash : this.scrollToHighlightFromHashSub,
      false,
    );
  }

  // 左右批注切换需要重新绑定左右滚动逻辑
  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<State>, snapshot?: any): void {
    const { curFlag } = this.state
    if (curFlag !== prevState.curFlag) {
      window.removeEventListener(
        "hashchange",
        prevState.curFlag === 'left' ? this.scrollToHighlightFromHash : this.scrollToHighlightFromHashSub,
        false,
      );
      window.addEventListener(
        "hashchange",
        curFlag === 'left' ? this.scrollToHighlightFromHash : this.scrollToHighlightFromHashSub,
        false,
      );
    }
  }

  getHighlightById(id: string, highlights: any[]) {
    // const { highlights,leftHighlights,rightHighlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);

  }

  // 为英文pdf添加或者中文pdf添加批注
  addHighlight(highlight: NewHighlight, type: string = 'left') {
    const { highlights, leftHighlights, rightHighlights } = this.state;

    console.log("Saving highlight", highlight);
    console.log([{ ...highlight, id: getNextId() }, ...(type === 'left' ? leftHighlights : rightHighlights)], 'uouououou')
    if (type === 'left') {
      this.setState({
        leftHighlights: [{ ...highlight, id: getNextId() }, ...leftHighlights],

      });
    } else {
      this.setState({
        rightHighlights: [{ ...highlight, id: getNextId() }, ...rightHighlights],

      });
    }
    // this.setState({
    //   highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    // });
  }

  updateHighlight(
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
    highlights: Array<IHighlight> | any,
    curFlag: string
  ) {
    console.log("Updating highlight", highlightId, position, content);
    // curFlag === 'left' ? 'leftHighlights' : 'rightHighlights'
    const updateFn = () => {
      return highlights.map((h: any) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest,
          }
          : h;
      });
    };
    if (curFlag === 'left') {
      this.setState({
        leftHighlights: updateFn()
      });
    } else {
      this.setState({
        rightHighlights: updateFn()
      });
    }

  }

  render() {
    // const { url, highlights } = this.state;
    const { leftHighlights, rightHighlights } = this.state;

    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={leftHighlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
          clickCb={() => {
            this.setCurFlagFn('left')
          }}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
        // className="pdf-render-box"
        >
          <PdfLoader url={PRIMARY_PDF_URL} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo: any) => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection,
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo,
                ) => {
                  const isTextHighlight = !highlight.content?.image;

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) },
                          leftHighlights,
                          'left'
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => (popupContent))
                      }
                      onMouseOut={hideTip}
                      key={index}
                    >
                      {component}
                    </Popup>
                  );
                }}
                highlights={leftHighlights}
              />
            )}
          </PdfLoader>
        </div>
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
        // className="pdf-render-box"
        >
          {/* <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <CommonPdf pdfDocument={pdfDocument} />
            )}
          </PdfLoader> */}
          <PdfLoader url={SECONDARY_PDF_URL} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter
                hideAnnotation={0}
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo: any) => {
                  console.log(scrollTo, '88888888')
                  this.scrollViewerToSub = scrollTo;

                  this.scrollToHighlightFromHashSub();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection,
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment }, 'right');

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo,
                ) => {
                  const isTextHighlight = !highlight.content?.image;

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                      highlightColor={this.highlightColor}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) },
                          rightHighlights,
                          'right'
                        );
                      }}
                      highlightColor={this.highlightColor}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => (popupContent))
                      }
                      onMouseOut={hideTip}
                      key={index}
                    >
                      {component}
                    </Popup>
                  );
                }}
                highlights={rightHighlights}
              />
            )}
          </PdfLoader>
        </div>
        <Sidebar
          highlights={rightHighlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
          clickCb={() => {
            this.setCurFlagFn('right')
          }}
        />
      </div>
    );
  }
}

export default App;
