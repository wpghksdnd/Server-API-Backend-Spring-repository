import { useEffect } from 'react'

export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title

    const upsertMeta = (name, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let tag = document.head.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        if (isProperty) tag.setAttribute('property', name)
        else tag.setAttribute('name', name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    if (description) {
      upsertMeta('description', description)
      upsertMeta('og:description', description, true)
      upsertMeta('twitter:description', description)
    }
    if (title) {
      upsertMeta('og:title', title, true)
      upsertMeta('twitter:title', title)
    }
  }, [title, description])

  return null
}
