/**
 * 基本元数据配置
 */
const state = {
  resourceType: {

  },
  paramsType: [
    'string',
    'number',
    'boolean',
    'object',
    'array',
    'array(string)',
    'array(number)',
    'array(boolean)',
    'array(object)',
    'array(array)'
  ],
  methods: [
    { value: 'get', label: 'GET' },
    { value: 'post', label: 'POST' },
    { value: 'put', label: 'PUT' },
    { value: 'delete', label: 'DELETE' },
    { value: 'patch', label: 'PATCH' },
    { value: 'head', label: 'HEAD' },
    { value: 'options', label: 'OPTIONS' }
  ],
  projectPower: [
    {
      value: '1',
      label: '所有者'
    },
    {
      value: '2',
      label: '管理员'
    },
    {
      value: '3',
      label: '开发人'
    },
    {
      value: '4',
      label: '游客'
    }
  ],
  groupPower: [
    {
      value: '1',
      label: '所有者'
    },
    {
      value: '2',
      label: '管理员'
    },
    {
      value: '3',
      label: '开发人'
    }
  ],
  pageType: [
    {value: '0', label: 'web'},
    {value: 1, label: 'flutter'},
  ],
  mockAdvice: [
    { value: '@id', desc: '随机id' },
    { value: '@increment', desc: '自增id' },
    { value: '@image', desc: '' },
    { value: '@email', desc: '' },
    { value: '@title', desc: '标题' },
    { value: '@word', desc: '单词' },
    { value: '@cparagraph', desc: '中文段落' },
    { value: '@csentence', desc: '中文句子' },
    { value: '@url', desc: '' },
    { value: '@pick', desc: '挑选数组中的一个' },
    { value: '@now', desc: '' },

    { value: '@boolean', desc: '' },
    { value: '@natural', desc: '' },
    { value: '@integer', desc: '' },
    { value: '@float', desc: '' },
    { value: '@character', desc: '' },
    { value: '@string', desc: '' },
    { value: '@range', desc: '' },
    { value: '@date', desc: '' },
    { value: '@time', desc: '' },
    { value: '@datetime', desc: '' },
    { value: '@dataImage', desc: '' },
    { value: '@color', desc: '' },
    { value: '@hex', desc: 'hex格式颜色' },
    { value: '@rgb', desc: 'rgb格式颜色' },
    { value: '@rgba', desc: 'rgba格式颜色' },
    { value: '@hsl', desc: 'hsl格式颜色' },
    { value: '@paragraph', desc: '段落' },
    { value: '@sentence', desc: '句子' },
    { value: '@cword', desc: '' },
    { value: '@ctitle', desc: '' },
    { value: '@first', desc: '' },
    { value: '@last', desc: '' },
    { value: '@name', desc: '' },
    { value: '@cfirst', desc: '' },
    { value: '@clast', desc: '' },
    { value: '@cname', desc: '' },
    { value: '@domain', desc: '域名' },
    { value: '@protocol', desc: '' },
    { value: '@tld', desc: '' },
    { value: '@ip', desc: '' },
    { value: '@region', desc: '地区' },
    { value: '@province', desc: '' },
    { value: '@city', desc: '' },
    { value: '@county', desc: '' },
    { value: '@zip', desc: '邮编' },
    { value: '@capitalize', desc: '' },
    { value: '@upper', desc: '' },
    { value: '@lower', desc: '' },
    { value: '@shuffle', desc: '' },
    { value: '@guid', desc: '32位唯一id' }
  ]
}
export default state
