import mongoose, { get } from "mongoose";

// ** Models

import User from "../models/User";
import { authConstant, permissionsConstrant } from "../constant";

export const permissionsService = {
    createPermissions: async (userId, data) => {
        const permissions = await User.create({
          ...data,
          userId,
        });  
        const permissionsJson = permissions.toJSON();    
        return permissionsJson;
      },
      
       getAllPermissions : async () => {
        try {
            const list = await User.find({});
            return {
                list,
            };
        } catch (error) {
            throw new Error(error.message)
        }
    },  
    deletePermissions: async (userId, permissionsId) => {
      const permissions = await FoPermissionslder.findById(permissionsId);
  
      if (!permissions) throw new Error(permissionsConstrant.PERMISSIONS_NOT_FOUND);
      if (!permissions.userId.equals(userId))
        throw new Error(authConstant.FORBIDDEN);
  
        permissions.isDelete = true;
  
      await permissions.save();
  
      const permissionsJson = permissions.toJSON();
  
      return permissionsJson;
    },
 

}