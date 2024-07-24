import React, { Component } from "react";

import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface Props {
  /** See `GlobalWorkerOptionsType`. */
  workerSrc: string;

  url: string;
  beforeLoad: JSX.Element;
  errorMessage?: JSX.Element;
  children: (pdfDocument: PDFDocumentProxy) => JSX.Element;
  onError?: (error: Error) => void;
  cMapUrl?: string;
  cMapPacked?: boolean;
}

interface State {
  pdfDocument: PDFDocumentProxy | null;
  error: Error | null;
  comments: any | null
}

export class PdfLoader extends Component<Props, State> {
  state: State = {
    pdfDocument: null,
    error: null,

    comments: null
  };

  static defaultProps = {
    workerSrc: "https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs",
  };

  documentRef = React.createRef<HTMLElement>();

  async getAllCommentsFromPDF(pdf: any) {
    // // 加载 PDF 文档
    // const pdf = await getDocument(pdfUrl).promise;
    console.log(pdf, '******')
    // 批注数组
    const comments: any[] = [];

    // 遍历 PDF 中的所有页面
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      if (!page.getAnnotations()) continue; // 如果页面没有批注，跳过
      // 获取页面上的批注
      // const pageComments = page.getAnnotations().filter((annotation: any) => annotation.subtype === 'Comment');
      page.getAnnotations().then((annotations: any) => {
        // console.log(annotations)
        annotations.forEach(function (annotationItem: any) {

          // console.log(annotationItem.type, annotationItem.rect, annotationItem, '89898989++++++');
          if (annotationItem.subtype === "Highlight") {
            comments.push(annotationItem)

          }

          // 在这里处理批注数据，例如渲染到页面
          // page.removeAnnotation(annotationItem);
        });

      })
      // 将批注添加到结果数组中
      // comments.push(...pageComments);
    }
    console.log(comments)
    // this.setState({ pdfDocument });
    this.setState({
      comments,
      pdfDocument: pdf
    })
    console.log(comments, '++++++++')

    // 返回所有批注
    return comments;

  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    const { pdfDocument: discardedDocument } = this.state;
    if (discardedDocument) {
      discardedDocument.destroy();
    }
  }

  componentDidUpdate({ url }: Props) {
    if (this.props.url !== url) {
      this.load();
    }
  }

  componentDidCatch(error: Error) {
    const { onError } = this.props;

    if (onError) {
      onError(error);
    }

    this.setState({ pdfDocument: null, error });
  }

  load() {
    const { ownerDocument = document } = this.documentRef.current || {};
    const { url, cMapUrl, cMapPacked, workerSrc } = this.props;
    const { pdfDocument: discardedDocument } = this.state;
    this.setState({ pdfDocument: null, error: null });

    if (typeof workerSrc === "string") {
      GlobalWorkerOptions.workerSrc = workerSrc;
    }

    Promise.resolve()
      .then(() => discardedDocument?.destroy())
      .then(() => {
        if (!url) {
          return;
        }

        const document = {
          ...this.props,
          ownerDocument,
          cMapUrl,
          cMapPacked,
          annotationMode: 0
        };

        return getDocument(document).promise.then((pdfDocument) => {
          this.setState({ pdfDocument });
          this.getAllCommentsFromPDF(pdfDocument)
        });
      })
      .catch((e) => this.componentDidCatch(e));
  }

  render() {
    const { children, beforeLoad } = this.props;
    const { pdfDocument, error } = this.state;
    return (
      <>
        <span ref={this.documentRef} />
        {error
          ? this.renderError()
          : !pdfDocument || !children
            ? beforeLoad
            : children(pdfDocument)}
      </>
    );
  }

  renderError() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return React.cloneElement(errorMessage, { error: this.state.error });
    }

    return null;
  }
}

export default PdfLoader;
