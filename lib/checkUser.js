
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import ConnectDb from "./Db";


export const CheckUser = async(req, res) => {
    await ConnectDb();
    const user = await currentUser();
    if(!user) return null;

    try {
        const loggedInUser = await User.findOne({clerkUserId: user.id});
        if(loggedInUser) return loggedInUser;


        const name = `${user.firstName} ${user.lastName}`;
        
        const newUser = await User.create({
            clerkUserId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: name,
            imageUrl: user.imageUrl,
            availability: null, 
        });
        return newUser;

    } catch (error) {
        console.log(error); 
    }
}