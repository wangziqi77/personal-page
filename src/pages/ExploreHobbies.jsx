import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang.jsx'

const hobbies = [
  {
    icon: '🏀',
    nameZh: '篮球',
    nameEn: 'Basketball',
    descZh: '球场是释放压力的地方，团队配合让我享受协作的快感。最爱打后卫，喜欢组织进攻。',
    descEn: 'The court is where I decompress. I love playing point guard and orchestrating the offense — the flow state of team basketball is unmatched.',
    color: '#F5E6C8',
  },
  {
    icon: '💪',
    nameZh: '健身',
    nameEn: 'Fitness',
    descZh: '规律训练是我保持专注和自律的方式。健身房是思考问题的最佳场所之一。',
    descEn: 'Consistent training is how I stay focused and disciplined. The gym is one of the best places to think through hard problems.',
    color: '#B5D5C5',
  },
  {
    icon: '⛷️',
    nameZh: '滑雪',
    nameEn: 'Skiing',
    descZh: '喜欢在雪坡上感受速度与控制的平衡。从阿尔卑斯到温哥华，雪山是我最喜欢的风景。',
    descEn: 'Finding the balance between speed and control on the slopes. From Alps to Vancouver, snow mountains are my favorite landscape.',
    color: '#A8C5DA',
  },
  {
    icon: '🎸',
    nameZh: '电吉他',
    nameEn: 'Electric Guitar',
    descZh: '摇滚是我内心的另一面，弦上有无限表达。喜欢前卫摇滚和数学摇滚。',
    descEn: 'Rock is my other self — infinite expression on six strings. Into prog rock and math rock.',
    color: '#C9C0D3',
  },
  {
    icon: '📷',
    nameZh: '摄影',
    nameEn: 'Photography',
    descZh: '用镜头记录旅途与日常中值得定格的瞬间。偏好纪实风格，喜欢捕捉真实的情绪和光线。',
    descEn: 'Capturing moments worth freezing — from travels to daily life. I prefer documentary style and chasing authentic light.',
    color: '#F2C6C2',
  },
]

export default function ExploreHobbies() {
  const { lang } = useLang()
  const isZh = lang === 'zh'

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/"
        className="inline-flex items-center gap-2 text-navy-400 hover:text-navy-600 text-sm mb-10 transition-colors group"
        state={{ scrollTo: 'explore' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        {isZh ? '返回主页' : 'Back to Home'}
      </Link>

      <div className="mb-12">
        <p className="text-navy-400/50 text-sm font-mono tracking-widest mb-2">Explore Me</p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy-700 mb-3">
          {isZh ? '兴趣爱好' : 'Hobbies'}
        </h1>
        <p className="text-navy-400 text-base">
          {isZh ? '工作之外，我是这样的人' : 'Outside of work, this is who I am'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {hobbies.map((h, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-cream-300 bg-cream-50
                       hover:border-navy-400/30 hover:shadow-md hover:-translate-y-1
                       transition-all duration-300 overflow-hidden"
          >
            <div className="h-2 w-full" style={{ backgroundColor: h.color }} />
            <div className="p-6">
              <span className="text-4xl mb-4 block">{h.icon}</span>
              <h3 className="text-navy-700 font-bold text-lg mb-2">
                {isZh ? h.nameZh : h.nameEn}
              </h3>
              <p className="text-navy-400 text-sm leading-relaxed">
                {isZh ? h.descZh : h.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
