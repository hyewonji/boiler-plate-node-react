/* process.env.NODE_ENV : 환경변수 확인 */
// Local환경이라면 development, 배포한 후라면 production을 사용한다.
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}