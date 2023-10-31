import React, { useCallback } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent } from "ag-grid-community";
import { useRecoilValue } from "recoil";
import { ModalWidthAtom, ModalHeightAtom } from "@/recoil/state/resizeAtom";
import { nodeAtom } from "@/recoil/state/nodeAtom";
import { useBoardListGetQuery } from "@/api/hooks/queries/board";
import { getBoardListData } from "@/api/board";
import { formatDateTime, DateTimeFormat } from "@/utils/dateTime";
import { BoardResponseDto } from "@/constants/types";
interface BoardTableProps {
  onClickedId: (id: number) => void;
}

function BoardTable({ onClickedId }: BoardTableProps) {
  const selectedNodeInfo = useRecoilValue(nodeAtom);

  const { data: boardListData } = useBoardListGetQuery(selectedNodeInfo.id);

  const formatBoardListData = (dataList: BoardResponseDto[]) => {
    return dataList?.map((data: BoardResponseDto) => ({
      ...data,
      updatedAt: formatDateTime(data.updatedAt, DateTimeFormat.Date),
    }));
  };

  const onRowDataClicked = (params: CellClickedEvent) => {
    onClickedId(params.data.id);
  };

  const columnDefs = [
    { field: "title" },
    { field: "userNickname" },
    { field: "updatedAt" },
  ];

  const modalWidth = useRecoilValue(ModalWidthAtom);
  const modalHeight = useRecoilValue(ModalHeightAtom);

  const onGridReady = useCallback((params: any) => {
    let afterCursor: any = null;

    const dataSource = {
      rowCount: undefined,
      getRows: async (params: any) => {
        try {
          const data = await getBoardListData(selectedNodeInfo.id, afterCursor);

          afterCursor = data?.cursor?.afterCursor;

          const rowsThisPage = formatBoardListData(data?.data);
          let lastRow = -1;
          if (!afterCursor) {
            lastRow = params.startRow + data?.data?.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          params.failCallback();
        }
      },
    };

    params.api.setDatasource(dataSource);
  }, []);

  return (
    <div
      className="ag-theme-alpine"
      style={{
        width: modalWidth - 70,
        height: modalHeight - 70,
        margin: "auto auto",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <AgGridReact
        rowBuffer={0}
        rowSelection={"multiple"}
        rowModelType={"infinite"}
        cacheBlockSize={10}
        cacheOverflowSize={2}
        maxConcurrentDatasourceRequests={1}
        infiniteInitialRowCount={10}
        maxBlocksInCache={10}
        onGridReady={onGridReady}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          minWidth: 100,
          width: 300,
          flex: 1,
        }}
        onCellClicked={onRowDataClicked}
      />
    </div>
  );
}

export default BoardTable;
