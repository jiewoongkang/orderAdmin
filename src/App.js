import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]); // 주문 상태 관리
  const [count, setCount] = useState(0);

  const onCompleted = (orderToComplete) => {
    console.log("complete", orderToComplete);
    // alert(JSON.stringify(order));
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderToComplete.id)
    );
    setCount(count + 1);
  };

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws"); // 서버 URL

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = (event) => {
      console.group("recieve");
      console.log("Message from server:", event.data);
      console.log(typeof event.data);

      const message = JSON.parse(event.data); // 메시지를 JSON으로 파싱

      setOrders((prevOrders) => {
        const newOrder = {
          ...message,
          id: prevOrders.length + 1, // 기존 orders의 길이에 1을 더해 id 생성
        };
        return [...prevOrders, newOrder];
      });
      console.groupEnd();
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (error instanceof ErrorEvent) {
        console.error("Error message:", error.message);
      }
    };
    //   컴포넌트 언마운트 시 소켓 연결 종료
    // return () => {
    //   if (socketRef.current) {
    //     socketRef.current.close();
    //     console.log("WebSocket connection closed");
    //   }
    // };
    return () => {
      socket.close();
    };
  }, []); // 빈 배열을 의존성으로 전달하여 마운트와 언마운트 시에만 실행되도록 합니다.

  return (
    <div className="App">
      <div id="wrap">
        <div className="check_kitchen_order tabWrap">
          <div className="header2">
            <div className="logo"></div>
            <div className="login_info">{/* 로그인 정보 */}</div>
          </div>
          <div className="top_area">
            <div className="select_area">{/* 선택 영역 */}</div>
            <div className="tab_area tabTitle">
              <ul>
                <li className="active">
                  <button type="button">접수 {orders.length}</button>
                </li>
                <li>
                  <button type="button">완료 {count}</button>
                </li>
              </ul>
            </div>
            <div className="sales_time">
              <span>영업</span>
            </div>
          </div>

          <div className="tabCont">
            {/* 접수 주문 리스트 */}
            <div className="on">
              <div className="order_list">
                <div className="order_sheet_list">
                  {orders.map((order, index) => (
                    <div className="order_sheet" key={index}>
                      {/* <div className="top_info red_type">
                        <div className="d-flex align-center">
                          <div className="floor"># 2층</div>
                          <div className="time">20:21</div>
                        </div>
                        <div className="d-flex align-center">
                          <div className="table_num">테이블23 - TOS43</div>
                          <div className="last_time">20:21</div>
                        </div>
                      </div> */}
                      <div className="order_sheet_cont">
                        <div className="btn_complete">
                          <button
                            type="button"
                            onClick={() => onCompleted(order)}
                          >
                            완료
                          </button>
                        </div>
                        <div className="order_menu">
                          <ul>
                            <li>
                              <div className="item_num">{order.quantity}x</div>
                              <div className="name">{order.name}</div>
                              <div className="s_menu">
                                <ul>
                                  <li>{order.price.toLocaleString()}</li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 완료 주문 리스트 */}
            <div className="complete">{/* 완료 주문 리스트 내용 */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
