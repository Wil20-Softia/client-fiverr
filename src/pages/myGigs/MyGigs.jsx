import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";
import "./MyGigs.scss";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest
        .get(
          `gigs?userId=${currentUser._id}`
        )
        .then((res) => {
          return res.data;
        })
  });

  const mutation = useMutation({
    mutationFn: (gigId) => {
      return newRequest.delete(`gigs/${gigId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"])
    }
  })

  const handleDelete = (gigId) => {
    mutation.mutate(gigId);
  }

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>{currentUser.isSeller ? "Gigs" : "Orders"}</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button>Agregar nuevo Gig</button>
            </Link>
          )}
        </div>
        {isLoading ? "Cargando..." : error ? "Ha ocurrido un error!" : 
        (
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Titulo</th>
              <th>Precio</th>
              <th>Ventas</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((gig)=>(
              <tr key={gig._id}>
                <td>
                  <img
                    className="image"
                    src={gig.cover}
                    alt=""
                  />
                </td>
                <td>{gig.title}</td>
                <td>{gig.price}</td>
                <td>{gig.sales}</td>
                <td>
                  <img className="delete" src="./img/delete.png" alt="" onClick={()=>handleDelete(gig._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

export default MyGigs;
