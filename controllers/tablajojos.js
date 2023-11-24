const {request, response} = require('express');
const bcrypt = require('bcrypt');
const tablajojosmodels = require('../models/tablajojos');
const pool=require('../db');


const listtablajojos = async (req = request, res = response) => {
    let conn; 

    try{
        conn = await pool.getConnection();

    const tablajojos = await conn.query (tablajojosmodels.getAll, (err)=>{
        if(err){
            throw err
        }
    });

    res.json(tablajojos);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
    
}

const listtablajojosByID = async (req = request, res = response) => {
    
    const {id} = req.params;
    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn; 
    try{
        conn = await pool.getConnection();

    const [tablajojos] = await conn.query (tablajojosmodels.getByID, [id], (err)=>{
        if(err){
            throw err
        }
    });

    if (!tablajojos) {
        res.status(404).json({msg: 'tablajojos not foud'});
        return;
    }
    
    
    res.json(tablajojos);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}





const addtablajojos =async(req = request, res= response)=>{
    let conn;
    const {
        id,
        Stand,
        PWR,
        SPD,
        RNG,
    } = req.body;
    if (!id|| !Stand|| !PWR|| !SPD|| !RNG){
res.status(400).json({msg:'Missing informarion'});

return;
}
/*
       let passwordHash
       if (password){
        const saltRounds = 10;
        passwordHash = await bcrypt.hash(password,saltRounds);
        }
*/
        const tablajojos= [id,Stand, PWR, SPD, RNG]

       
    
    try {

        conn = await pool.getConnection();
        
        const [StandUser] = await conn.query(
            tablajojosmodels.getByStand,
            [Stand],
            (err) => {if (err) throw err;}
        );
        if (StandUser){
            res.status(409).json({msg:`tablajojos with Stand ${Stand} already exists`});
            return;
        }
        
        const tablajojosAdded = await conn.query(tablajojosmodels.addRow,[...tablajojos],(err)=>{

        })
        
        if (tablajojosAdded.affecteRows === 0) throw new Error ({msg:'Failed to add tablajojos'});
        res.json({msg:'tablajojos add succesfully'});
    }catch(error){
console.log(error);
res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

const updatetablajojos=async(req, res)=>{
    const {
  
        Stand,
        PWR,
        SPD,
        RNG,
        
    } = req.body;

const {id} = req.params;
let newUserData=[
    Stand,
    PWR,
    SPD,
    RNG,
   
];
let conn;
try{
    conn = await pool.getConnection();
const [userExists]=await conn.query(
    tablajojosmodels.getByID,
    [id],
    (err) => {if (err) throw err;}
);
if (!userExists || userExists.id === 0){
    res.status(404).json({msg:'User not found'});
    return;
}

const [StandUser] = await conn.query(
    tablajojosmodels.getByStand,
    [Stand],
    (err) => {if (err) throw err;}
);
if (StandUser){
    res.status(409).json({msg:`User with Stand ${Stand} already exists`});
    return;
}


const oldUserData = [
    userExists.Stand, 
    userExists.PWR, /////////////
    userExists.SPD, ///////////////
    userExists.RNG, ////////////////////// 
   
];

newUserData.forEach((jojosData, index)=> {
    if (!jojosData){
        newUserData[index] = oldUserData[index];
    }
})

const userUpdate = await conn.query(
    tablajojosmodels.updateUser,
    [...newUserData, id],
    (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
    throw new Error ('User not updated');
}
res.json({msg:'User updated successfully'})
}catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const deletetablajojos = async (req, res)=>{
    const {id} = req.params;
    let conn;

    try{
        conn = await pool.getConnection();
       const  eliminar= await conn.query(tablajojosmodels.deleteRow,[id]);

        if(eliminar.affecteRows=== 0){
            res.status(404).json({msg:'User not Found'});
            return;
        }

        res.json({msg:'user deleted succesfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);

    }finally{
       if(conn) conn.end(); 
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////





module.exports={listtablajojos, listtablajojosByID, addtablajojos, updatetablajojos, deletetablajojos};