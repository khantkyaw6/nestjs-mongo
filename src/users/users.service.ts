import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserSettings } from 'src/schemas/UserSettings.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
  ) {}

  async createUser({ settings, ...createUserDto }: CreateUserDto) {
    if (settings) {
      const newSettings = new this.userSettingsModel(settings);
      const savedNewSettings = await newSettings.save();

      const newUser = new this.userModel({
        ...createUserDto,
        settings: savedNewSettings._id,
      });
      return await newUser.save();
    }

    const newUser = new this.userModel(createUserDto);
    console.log(newUser);
    return await newUser.save();
  }

  getUsers() {
    const users = this.userModel.find().populate([
      {
        path: 'settings',
        select: '-__v -updatedAt',
      },
      {
        path: 'posts',
        select: '-__v -updatedAt',
      },
    ]);
    return users;
  }

  async getUserById(id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);
    const user = await this.userModel.findById(id).populate([
      {
        path: 'settings',
        select: '-__v -updatedAt',
      },
      {
        path: 'posts',
        select: '-__v -updatedAt',
      },
    ]);
    if (!user) {
      throw new HttpException('User not found!', 404);
    }
    return user;
  }

  async updateUserById(id: string, updateUser: UpdateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('User not found', 404);

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUser, {
      new: true,
    });
    return updatedUser;
  }

  async deleteUserById(id: string) {
    // await this.getUserById(id);

    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser)
      throw new HttpException('User Not Found for delete.', 404);
    console.log(deletedUser);
    return deletedUser;
  }
}
