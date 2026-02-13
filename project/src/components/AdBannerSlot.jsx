import { useEffect, useState } from 'react'
import { api } from '../api'

export default function AdBannerSlot({ slot }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.adsBySlot(slot).then((r) => {
      if (r.ok) setItems(r?.data?.data || [])
    })
  }, [slot])

  if (!items.length) return null

  return (
    <div className="grid" style={{ gap: 10 }}>
      {items.map((ad) => (
        <a
          key={ad.id}
          href={ad.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="ad-banner"
          style={{ background: ad.bgColor || '#FFFBB1' }}
          onClick={() => api.adClick(ad.id)}
        >
          <img src={ad.imageUrl} alt={ad.title} className="ad-thumb" />
          <div>
            <p className="muted" style={{ margin: 0 }}>AD</p>
            <h3 style={{ margin: '2px 0 4px' }}>{ad.title}</h3>
            <p style={{ margin: 0 }}>{ad.description}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
