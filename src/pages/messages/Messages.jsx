import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest
        .get(
          `conversations/`
        )
        .then((res) => {
          return res.data;
        })
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"])
    }
  })

  const handleRead = (id) => {
    mutation.mutate(id);
  }

  return (
    <div className="messages">
      {isLoading ? 
      "Cargando..." : 
      error ? 
      "Ha ocurrido un error!" : 
      (<div className="container">
        <div className="title">
          <h1>Mensajes</h1>
        </div>
        <table>
          <thead>
            <tr>
              <th>{currentUser.isSeller ? "Comprador" : "Vendedor"}</th>
              <th>Ultimo Mensaje</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr 
                className={((currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer)) ? "active":""} 
                key={c.id}
              >
                <td>{currentUser.isSeller ? c.buyerId: c.sellerId}</td>
                <td>
                  <Link to={`/message/${c.id}`} className="link">
                    {c?.lastMessage?.substring(0, 100)}...
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>
                  {((currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer)) && (
                    <button onClick={()=>handleRead(c.id)}>Marcar como leido</button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default Messages;
