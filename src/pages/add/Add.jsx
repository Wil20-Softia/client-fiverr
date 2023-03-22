import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {

  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post('gigs', gig)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"])
    }
  })

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value }
    });
  }

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value
    });
    e.target[0].value = ""
  }

  const handleUpload = async () => {
    setUploading(true);
    try{
      const cover = await upload(singleFile)

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } })
    }catch(err){
      console.log(err);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
    navigate("/myGigs")
  }

  console.log(state);

  return (
    <div className="add">
      <div className="container">

        <h1>Agregar nuevo Gig</h1>
        
        <div className="sections">
          <div className="info">

            <label htmlFor="">Título</label>
            <input
              type="text"
              name="title"
              placeholder="ejm. Haré algo en lo que soy realmente bueno"
              onChange={handleChange}
            />

            <label htmlFor="">Categoria</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Diseño</option>
              <option value="web">Desarrollo web</option>
              <option value="animation">Animación</option>
              <option value="music">Música</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Imagen de portada</label>
                <input type="file" name="cover" onChange={(e) => setSingleFile(e.target.files[0])}/>

                <label htmlFor="">Cargar imagenes</label>
                <input type="file" name="images" multiple onChange={(e) => setFiles(e.target.files)}/>
              </div>
              <button onClick={handleUpload}>{uploading ? "Subiendo..." : "Subir"}</button>
            </div>
            <label htmlFor="">Descripción</label>
            <textarea 
              name="desc" 
              id="desc" 
              placeholder="Breve descripción para darle una introducción a los clientes" 
              cols="0" 
              rows="16"
              onChange={handleChange}
            ></textarea>

            <button onClick={handleSubmit}>Crear gig</button>

          </div>

          <div className="details">
            
            <label htmlFor="">Título del servicio</label>
            <input type="text" name="shortTitle" placeholder="e.g. One-page web design" onChange={handleChange}/>
            
            <label htmlFor="">Descripción corta</label>
            <textarea 
              name="shortDesc" 
              placeholder="Short description of your service" 
              cols="30" 
              rows="10"
              onChange={handleChange}
            ></textarea>
            
            <label htmlFor="">Tiempo de entrega (ejm. 3 dias)</label>
            <input type="number" name='deliveryTime' onChange={handleChange}/>
            
            <label htmlFor="">Número de revisiones</label>
            <input type="number" name='revisionNumber' onChange={handleChange}/>
            
            <label htmlFor="">Agregar Características</label>
            <form action="" className="add" onSubmit={handleFeature}>
              
              <input type="text" placeholder="ejm. diseño de página" />
            
              <button type="submit">Agregar</button>
            
            </form>
            
            <div className="addedFeature">
              {state?.features?.map((f)=>(
                <div className="item" key={f}>
                  <button onClick={()=>dispatch({ type: "REMOVE_FEATURE", payload: f})}>
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label htmlFor="">Precio</label>
            <input type="number" name='price' onChange={handleChange}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
