
/* ==========================================
   DEVELOPER HUB — VERSION HISTORY DATA
   ========================================== */

// Sürüm değişikliği türü
export type ChangeType =
  | 'added'
  | 'changed'
  | 'fixed'
  | 'removed'

// Tek bir değişiklik kaydı
export interface VersionChange {
  type: ChangeType
  description: string
}

// Bir proje sürümü
export interface ProjectVersion {
  id: string
  projectSlug: string
  version: string
  date?: string
  title: string
  description?: string
  changes: VersionChange[]
}

// Sürüm geçmişi
export const versions: ProjectVersion[] = [

  // Gerçek sürüm bilgileri doğrulandığında
  // buraya eklenecek.
  //
  // ÖRNEK:
  //
  // {
  //   id: 'signal-fastsetup-v1',
  //   projectSlug: 'signal-fastsetup',
  //   version: '1.0.0',
  //   date: '2026-11-24',
  //   title: 'Initial Release',
  //   description: 'First public release.',
  //   changes: [
  //     {
  //       type: 'added',
  //       description: 'Initial plugin functionality.'
  //     }
  //   ]
  // }


// ÖRNEK VERİ — Gerçek sürüm bilgisi değildir.

    {
    id: 'signal-fastsetup-v1-0-0',
    projectSlug: 'signal-fastsetup',
    version: '1.0.0',
    title: 'Initial Release',
    date: '2026-11-24',
    description: 'First public release.',
    changes: [
        {
        type: 'added',
        description: 'Signal module import support.'
        },
        {
        type: 'added',
        description: 'Autocomplete functionality.'
        }
    ]
    },
    {
    id: 'project-slug-v1-0-0',
    projectSlug: 'project-slug',
    version: '1.0.0',
    date: 'YYYY-MM-DD',
    title: 'Release Title',
    description: 'Release description.',
    changes: [
        {
        type: 'added',
        description: 'Describe the new feature.'
        },
        {
        type: 'fixed',
        description: 'Describe the fixed issue.'
        }
    ]
    }


]
