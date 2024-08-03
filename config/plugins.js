module.exports = (env) => ({
    i18n: {
        enabled: true,
        config: {
            locales: ['en', 'zh'],
            defaultLocale: 'zh',
        },
    },
    'responsive-image': {
        enabled: true,
        config: {
          // Optional configuration options
          sizes: [
            { name: 'mini', width: 100, format: 'jpeg' },
            { name: 'small', width: 120, format: 'jpeg' },
            { name: 'medium', width: 500, format: 'jpeg' },
          ],
          // You can add other options if needed, such as:
          quality: 80, // Set the JPEG quality
          progressive: true, // Use progressive scan for JPEGs
        },
      },
    localazy: {
        config: {
            /**
             * both options may help guard against DoS attacks
             * if `populateMaxDepth` < 5; the Localazy Strapi Plugin may not work as expected
             */
            populateDefaultDepth: 5, // default is 5
            populateMaxDepth: 10, // default is 10
        },
    },
    upload: {
        config: {
            providerOptions: {
                localServer: {
                    maxage: 300000
                },
            },
        },
    },
    'users-permissions': {
        config: {
            jwt: {
                expiresIn: '7 days',
            },
        },
    },

    /*     'email': {
            config: {
                provider: 'nodemailer',
                providerOptions: {
                    // QQ邮箱服务器和默认端口
                    host: env('SMTP_HOST', 'smtp.qq.com'),
                    port: env('SMTP_PORT', 465),
                    auth: {
                        // 发送账号和客户端鉴权码
                        user: env('SMTP_USERNAME', 'ituyang@foxmail.com'),
                        pass: env('SMTP_PASSWORD', 'ielvznhsmububafg'),
                    },
                    // ... any custom nodemailer options
                },
                settings: {
                    // 默认发送账号
                    defaultFrom: 'ituyang@foxmail.com',
                    // 默认回复账号
                    defaultReplyTo: 'ituyang@foxmail.com',
                },
            },
        }, */
});
