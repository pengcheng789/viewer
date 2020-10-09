import { Button, message, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist';
import pdfjsWork from 'pdfjs-dist/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = pdfjsWork;

const contaienrStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 48,
  marginLeft: 24,
  marginRight: 24,
  padding: 24,
  boxShadow: 'rgb(239, 242, 250) 0px 0px 10px 8px',
  display: 'flex',
  flex: 'none',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center'
};

const App: React.FC = () => {
  const fileInpurRef = useRef<HTMLInputElement>(null);
  const onSelectFile = () => {
    fileInpurRef.current?.click();
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handling, setHandling] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [buffer, setBuffer] = useState<ArrayBuffer>();
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const reg = /\.(docx?|xlsx?|pptx?)$/
    if (!reg.test(file.name)) {
      message.error('必须选择 docx、doc、xls、xlsx、ppt 或者 pptx 文件。');
      return;
    }

    setHandling(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const repsonse = await fetch('/gotenberg/convert/office', {
        method: 'POST',
        body: formData
      });
      // const blob = await repsonse.clone().blob();
      // console.log(blob);
      // const blobUrl = window.URL.createObjectURL(blob);
      // const aElement = document.createElement('a');
      // aElement.href = blobUrl;
      // aElement.download = file.name.replace(/\..+?$/, '.pdf');
      // aElement.click();
      // window.URL.revokeObjectURL(blobUrl);

      const buffer = await repsonse.arrayBuffer();
      setPageNum(1);
      setBuffer(buffer);
    } catch (e) {
      console.log(e);
      setHandling(false);
      message.error('解析错误');
    }
  };
  const onPrev = () => {
    if (pageNum === 1) return;
    setPageNum(pageNum => pageNum - 1);
  };
  const onNext = () => {
    if (pageNum === totalPage) return;
    setPageNum(pageNum => pageNum + 1);
  }
  useEffect(() => {
    if (!buffer) return;

    setHandling(true);

    const loadingTask = getDocument(buffer);
    loadingTask.promise.then(pdf => {
      setTotalPage(pdf.numPages);
      pdf.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;
        const context = canvasElement.getContext('2d');
        canvasElement.width = viewport.width;
        canvasElement.height = viewport.height;

        page.render({
          canvasContext: context!,
          viewport
        }).promise.then(() => setHandling(false));
      });
    }, e => {
      setHandling(false);
      console.log(e);
      message.error('解析错误');
    });
  }, [buffer, pageNum]);

  return (
    <Spin spinning={handling}>
      <div
        style={contaienrStyle}
      >
        <Button
          type="primary"
          onClick={onSelectFile}
          style={{ marginRight: 24 }}
          disabled={handling}
        >
          选择文件
        </Button>

        <Button
          onClick={onPrev}
          disabled={handling || pageNum === 1}
          style={{ marginRight: 16 }}
        >
          上一页
        </Button>

        <Button
          onClick={onNext}
          disabled={handling || pageNum === totalPage}
        >
          下一页
        </Button>

        <div
          style={{ width: '90%', padding: 16 }}
        >
          <div >
            <canvas ref={canvasRef} />
          </div>
        </div>

        <input
          type="file"
          hidden={true}
          onChange={onFileChange}
          ref={fileInpurRef}
        />
      </div>
    </Spin>
  );
};

export default App;
