import { motion } from 'framer-motion'
import './PhotoCard.css'

interface PhotoCardProps {
  image: string
  isActive: boolean
  style: React.CSSProperties
}

const PhotoCard = ({ image, isActive, style }: PhotoCardProps) => {
  return (
    <motion.div
      className={`photo-card ${isActive ? 'active' : ''}`}
      style={style}
      animate={{
        y: [0, -10, 0],
        rotate: [style.transform?.match(/rotate\((.*?)deg\)/)?.[1] || 0,
                parseFloat(style.transform?.match(/rotate\((.*?)deg\)/)?.[1] || '0') + 1,
                style.transform?.match(/rotate\((.*?)deg\)/)?.[1] || 0]
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* 拍立得边框 */}
      <div className="polaroid-frame">
        {/* 图片 */}
        <img
          src={image}
          alt="Memory"
          className="photo-content"
        />

        </div>

      {/* 阴影 */}
      <div className="photo-shadow" />
    </motion.div>
  )
}

export default PhotoCard