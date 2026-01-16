const connection = require('../config/database');

const findAll = async () => {
    const [rows] = await connection.query('SELECT * FROM Users');
    return rows;
}

const findById = async (id) =>{
    const [rows] = await connection.query(
        'select id, email, name, city from Users where id = ?',
        [id]
    );

    return rows[0] || null;
};

const create = async ({email, name, city}) => {
    const [result] = await connection.query(
        'INSERT INTO Users (email, name, city) VALUES (?, ?, ?)',
        [email, name, city]
    );
    return {
        id: result.insertId,
        email,
        name,
        city
    };
};

const updateById = async (id, {email, name, city}) => {
    const [result]= await connection.query(
        'UPDATE Users SET email = ?, name = ?, city = ? WHERE id = ?',
        [email, name, city, id]
    );
    return result.affectedRows > 0;

};


const deleteById = async (id) => {
    const [result] = await connection.query(
        'DELETE FROM Users WHERE id = ?',
        [id]
    );
    return result.affectedRows ;
}


module.exports = {
    findAll, findById, create, updateById, deleteById
}