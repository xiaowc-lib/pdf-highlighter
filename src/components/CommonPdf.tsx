
import React, { useState, useEffect, useRef } from 'react'
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { EventBus, PDFViewer } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import {
    findOrCreateContainerLayer,
} from "../lib/pdfjs-dom";

import { PDFViewer as PDFViewerFn, EventBus as EventBusFn } from "pdfjs-dist/web/pdf_viewer.mjs"


interface PropsType {
    pdfDocument: PDFDocumentProxy;
    curPage?: number;
}

const CommonPdf: React.FC<PropsType> = function ({ pdfDocument, curPage = 1 }) {
    const pdfRef: any = useRef(null);
    const viewRef: any = useRef(null);

    // function renderOtherPage(pdfDoc:any, pageNumber:number) {
    //     return new Promise(resolve => {
    //       pdfDoc.getPage(pageNumber).then((page:any) => {
    //         const scale = 1.5; 
    //         const viewport = page.getViewport({ scale: scale }); 
    //         const canvas = document.createElement('canvas'); 
    //         const context = canvas.getContext('2d');

    //         canvas.height = viewport.height;
    //         canvas.width = viewport.width;

    //         document.getElementById('pdf-container').appendChild(canvas); 

    //         const renderContext = {
    //           canvasContext: context,
    //           viewport: viewport
    //         };

    //         page.render(renderContext); 
    //         resolve();
    //       });
    //     });
    //   }

    const renderHighlightLayers = (pdfDocument: any) => {
        console.log('787879999999')
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
            console.log('77777')
            // const { textLayer } = viewRef.current.getPageView(pageNumber) || {};
            // console.log(textLayer, '000000')
            // findOrCreateHighlightLayer(pageNumber);
            findOrCreateContainerLayer(pdfRef.current, 'read-pdf-page')
        }
    }

    const getPdf = (pdfDocument: any) => {
        // const container = document.getElementById('pageContainer') // 获取挂载点
        // const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
        // 实例化pdf视图
        const eventBus = new EventBusFn()
        viewRef.current = new PDFViewerFn({
            container: pdfRef.current,
            eventBus,
            annotationMode: 0
        })
        viewRef.current.setDocument(pdfDocument)
        // // 加载pdf文件
        // const loadingTask = pdfjsLib.getDocument(props.url)
        // // 使用await等待加载完毕
        // const pdf = await loadingTask.promise
        // // 开始绘制到dom
        // pdfViewer.setDocument(pdf)
        // 监听pagerendered来实现 判断 是否渲染完成，如果要打印一定要渲染完成后再打印，不然会有空白
        // console.log(pdfRef.current)
        // renderHighlightLayers(pdfDocument)

        eventBus.on('pagesinit', function (e: any) {
            console.log('36221212')
            // if (e.detail.pageNumber === pdfDocument.numPages) {
            //     // emit('pdfload', pdf) // 渲染完成，通知父组件
            //     console.log('渲染完成')
            //     renderHighlightLayers(pdfDocument)
            // }
            renderHighlightLayers(pdfDocument)

        })
    }

    const findOrCreateHighlightLayer = (page: number) => {
        const { textLayer } = viewRef.current.getPageView(page - 1) || {};
        console.log(textLayer, 'vvvvv')

        if (!textLayer) {
            return null;
        }

        return findOrCreateContainerLayer(
            textLayer.div,
            "PdfHighlighter__highlight-layer",
        );
    }





    useEffect(() => {
        if (pdfDocument && pdfRef.current) {
            console.log('89898989-----')
            getPdf(pdfDocument)
        }

    }, [pdfDocument])



    return (
        <div id="pageContainer" ref={pdfRef} style={{ position: 'absolute' }}>
            <div id="viewer" className="pdfViewer" ></div>
        </div>


    )
}

export { CommonPdf } 