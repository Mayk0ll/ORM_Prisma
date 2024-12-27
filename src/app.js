import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';


export const app = express();
export const prisma = new PrismaClient();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const populateDB = async () => {
    try {

        await prisma.cities.upsert({ where: { id: 'cm55yoqpt0000uoakgciwwiwn' }, update: { name: 'Medellin' }, create: { id: 'cm55yoqpt0000uoakgciwwiwn', name: 'Medellin' } });
        await prisma.cities.upsert({ where: { id: 'cm55yoqq10001uoakav3t6t5y' }, update: { name: 'Bogota' }, create: { id: 'cm55yoqq10001uoakav3t6t5y', name: 'Bogota' } });
        await prisma.cities.upsert({ where: { id: 'cm55yoqqe0002uoakg94c283s' }, update: { name: 'Cali' }, create: { id: 'cm55yoqqe0002uoakg94c283s', name: 'Cali' } });

        const user1 = await prisma.user.upsert({ 
            where: { id: 'ckq1z1z7d0000uoakg1z1z7d0' }, 
            update: { name: 'Michael', email: 'michael@gmail.com', age: 25, password: '123456', city_id: 'cm55yoqpt0000uoakgciwwiwn' }, 
            create: { id: 'ckq1z1z7d0000uoakg1z1z7d0', name: 'Michael', email: 'michael@gmail.com', age: 25, password: '123456', city_id: 'cm55yoqpt0000uoakgciwwiwn' }
        });
        const user2 = await prisma.user.upsert({
            where: { id: 'ckq1z1z7d0000uoakg1z1z7d1' },
            update: { name: 'John', email: 'John@gmail.com', age: 30, password: '123456', city_id: 'cm55yoqpt0000uoakgciwwiwn' },
            create: { id: 'ckq1z1z7d0000uoakg1z1z7d1',  name: 'John', email: 'John@gmail.com', age: 30, password: '123456', city_id: 'cm55yoqpt0000uoakgciwwiwn' }
        });
        const user3 = await prisma.user.upsert({
            where: { id: 'ckq1z1z7d0000uoakg1z1z7d2' },
            update: { name: 'Alice', email: 'alice@gmail.com', age: 35, password: '123456', city_id: 'cm55yoqq10001uoakav3t6t5y' },
            create: { id: 'ckq1z1z7d0000uoakg1z1z7d2', name: 'Alice', email: 'alice@gmail.com', age: 35, password: '123456', city_id: 'cm55yoqq10001uoakav3t6t5y' }
        });
        const user4 = await prisma.user.upsert({
            where: { id: 'ckq1z1z7d0000uoakg1z1z7d3' },
            update: { name: 'Bob', email: 'bob@gmail.com', age: 40, password: '123456', city_id: 'cm55yoqq10001uoakav3t6t5y' },
            create: { id: 'ckq1z1z7d0000uoakg1z1z7d3', name: 'Bob', email: 'bob@gmail.com', age: 40, password: '123456', city_id: 'cm55yoqq10001uoakav3t6t5y' }
        });

        await prisma.post.create({ data: { title: 'Post 1', content: 'This is the first post', author: { connect: { id: user1.id } }} });
        await prisma.post.create({ data: { title: 'Post 2', content: 'This is the second post', author: { connect: { id: user2.id } }} });
        await prisma.post.create({ data: { title: 'Post 3', content: 'This is the third post', author: { connect: { id: user3.id } }} });
        await prisma.post.create({ data: { title: 'Post 4', content: 'This is the fourth post', author: { connect: { id: user4.id } }} });
        await prisma.post.create({ data: { title: 'Post 6', content: 'This is the first post', author: { connect: { id: user1.id } }} });
        await prisma.post.create({ data: { title: 'Post 7', content: 'This is the second post', author: { connect: { id: user3.id } }} });
        
        //otra manera de hacerlo con el metodo create y connect en el objeto de posts   
        const user5 = await prisma.user.upsert({
            where: { id: 'ckq1z1z7d0000uoakg1z1z7d4' },
            update: { name: 'Eve', email: 'eve@gmail.com', age: 45, password: '123456', city_id: 'cm55yoqqe0002uoakg94c283s' },
            create: { id: 'ckq1z1z7d0000uoakg1z1z7d4',name: 'Eve', email: 'eve@gmail.com', age: 45, password: '123456', city_id: 'cm55yoqqe0002uoakg94c283s', posts: { create: { title: 'Post 5', content: 'This is the fifth post' } } }
        });

    } catch (error) {
        console.log(error);
    }
}

populateDB(); 

app.post('/users', async (req, res) => {
    try {
        const { email, name, age, password, city_id } = req.body;
        const user = await prisma.user.create({
            data: {
                email,
                name,
                age,
                password,
                city_id,
            },
        });
        res.json({data: user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({ include: { city: true, posts: true } });
        res.json({data: users});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, age, password } = req.body;
        const user = await prisma.user.update({
            where: { id },
            data: {
                email,
                name,
                age,
                password,
            },
        });
        res.json({data: user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.json({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({ error: error.meta.cause });
    }
});