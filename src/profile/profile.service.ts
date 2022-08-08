import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { FollowEntity } from './profile.entity';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername,
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });
    console.log('follow', follow, currentUserId, user.id);

    return { ...user, following: Boolean(follow) };
  }

  async followProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername,
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }
    // const follow = await this.followRepository.findOne({
    //     followerId: currentUserId,
    //     followingId: user.id,
    //   });
    //   console.log('follow', follow, currentUserId, user.id);
    const follow = await getRepository(FollowEntity)
      .createQueryBuilder('follows')
      .where(
        'follows.followerId = :followerId AND follows.followingId = :followingId',
        { followerId: currentUserId, followingId: user.id },
      )
      .getOne();
      console.log(follow);
      
    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = user.id;
      followToCreate.followingId = currentUserId;
      await this.followRepository.save(followToCreate);
    }
    return { ...user, following: true };
  }
  async unfollowProfile(
    currentUserId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername,
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });
    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email; // delete email in profile response
    return { profile };
  }
}
