const tablajojosmodels = {
    getAll: `
    SELECT 
    * 
    FROM 
    tablajojos`,
    getByID: `
    SELECT
    *
    FROM
    tablajojos
    WHERE
    id= ?
    `,
    addRow:`
    INSERT INTO
    tablajojos(
        id,
        Stand,
        PWR,
        SPD,
        RNG
    )
    VALUES (
        ?,?,?,?,?
    )`,
    getByStand:`
    SELECT 
    * 
    FROM 
    tablajojos 
    WHERE Stand =?
    `,
/*/

getByEmail:`
    SELECT 
    id 
    FROM 
    tablajojos
    WHERE 
     =?
    `,
*/
    updateUser:`
    UPDATE
    tablajojos
    SET
    Stand = ?,
    PWR = ?,
    SPD = ?,
    RNG = ?
        WHERE 
        id =?
    `,

    deleteRow:`
    UPDATE 
    tablajojos
    SET
    PWR = ""
    WHERE 
    id=?
    `,
    
    
}

module.exports=tablajojosmodels;