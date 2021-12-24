const project = process.env.NODE_ENV === 'pro' ? 'dist/pro/mp-weixin' : 'dist/dev/mp-weixin';
const miniProgram = {
    appid: 'wx43970f2914c69223',
    type: 'miniProgram',
    projectPath: project,
    privateKey: 'f213a8496674344111e38b3937ab8c54',
};

export default miniProgram