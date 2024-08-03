'use strict';
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

module.exports = {
  async updateAvatar(ctx) {
    const user = ctx.state.user; // 获取当前登录用户的详细信息

    if (!ctx.is('multipart')) {
      return ctx.badRequest('需要 multipart 请求');
    }

    const { files } = ctx.request;

    if (!files || !files.avatar) {
      return ctx.badRequest('没有上传文件');
    }

    const file = files.avatar;

    // 检查文件类型
    if (file.type !== 'image/png') {
      return ctx.badRequest('文件类型不正确，只支持png格式文件' + file.type);
    }

    // 检查文件尺寸（高宽）
    try {
      const image = sharp(file.path);
      const metadata = await image.metadata();
      if (metadata.width < 120 || metadata.height < 120) {
        return ctx.badRequest('文件尺寸超过最小应该为（120x120）');
      }
      if (metadata.width > 500 || metadata.height > 500) {
        return ctx.badRequest('文件尺寸超过最大限制（500x500）');
      }
    } catch (error) {
      return ctx.badRequest('无法处理的图片类型');
    }
    // 获取当前用户的详细信息，包括头像
    let oldAvatarId = null;
    try {
      const userInfo = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, { populate: ['avatar'] });
      oldAvatarId = userInfo?.avatar; // 获取旧头像 ID

    } catch (error) {
      return ctx.badRequest('获取用户信息失败');
    }
    // 删除旧头像
    // 尝试直接删除文件
    if (oldAvatarId?.id) {
      console.log(oldAvatarId);
      try {
        await strapi.query('plugin::upload.file').delete({ where: { id: oldAvatarId.id } });
        //删除本地图片
        const filePath = ['large_', 'medium_', 'small_', 'thumbnail_', '']
        const MainFileu = path.resolve(__dirname, '..', '..', '..', '..', 'public', 'uploads');
        for (let i = 0; i < filePath.length; i++) {
          const element = path.resolve(MainFileu, filePath[i] + oldAvatarId?.hash + oldAvatarId?.ext);
          try {
            if (fs.existsSync(element)) {
              fs.unlinkSync(element);
              console.log(i, '文件删除成功');
            } else {
              console.log(i, '文件不存在', element);
            }
          } catch (error) {
            console.error(i, '文件删除失败:', error);
          }
        }
      } catch (error) {
        console.error('删除旧头像失败:', oldAvatarId.id, error);
        return ctx.badRequest('删除旧头像失败');
      }
    }


    // 使用 Strapi 的 upload 服务来上传文件
    const uploadService = strapi.plugin('upload').service('upload');
    const uploadedFiles = await uploadService.upload({
      data: { alternativeText: `avatar ${user.id}` },
      files: file,
    });

    if (uploadedFiles.length === 0) {
      return ctx.badRequest('文件上传失败');
    }

    // 更新用户的头像字段（需要将头像 ID 存储到用户数据中）
    try {
      const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          avatar: uploadedFiles[0].id,
        },
      });
      return ctx.send({ user: updatedUser });
    } catch (error) {
      console.error('更新用户头像失败:', error);
      return ctx.badRequest('更新用户头像失败');
    }
    
  },
};
