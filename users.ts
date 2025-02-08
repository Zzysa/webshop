import bcrypt from 'bcryptjs';

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
}

export function hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10); 
    return bcrypt.hashSync(password, salt); 
}

export function checkPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
}

function loadUsers(): User[] {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [
        {
            id: 0,
            name: "Admin",
            surname: "Admin",
            email: "admin@gmail.com",
            password: hashPassword("adminpass"),
            role: "Admin"
        },
        {
            id: 1,
            name: "User",
            surname: "User",
            email: "user@gmail.com",
            password: hashPassword("userpass"),
            role: "User"
        }
    ];
}

function saveUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
}

let users: User[] = loadUsers();

export { users, saveUsers };