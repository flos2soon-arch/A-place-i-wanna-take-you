import { motion } from 'framer-motion'

const ContentCard = ({
  src,
  onClose
}: {
  src: string
  onClose: () => void
}) => {

  // 处理点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <motion.div
      className="content-card-backdrop"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="content-card"
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 20
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
          y: 20
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="content-card-image-wrapper">
          <img
            src={src}
            alt="Memory Fragment"
            className="content-card-image"
          />
        </div>

        {/* 粉色光晕效果 */}
        <div className="content-card-glow" />
      </motion.div>
    </motion.div>
  )
}

export default ContentCard