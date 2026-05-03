import { FileType } from '~/data/fileSystem';

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  [FileType.Folder]: 'Pasta de Arquivos',
  [FileType.Txt]: 'Arquivo de Texto',
  [FileType.Jpg]: 'Imagem JPEG',
  [FileType.Mp3]: 'Arquivo de Áudio',
  [FileType.Exe]: 'Aplicativo',
  [FileType.Html]: 'Arquivo HTML',
  [FileType.Doc]: 'Documento',
};

export function fileTypeLabel(type: string) {
  return FILE_TYPE_LABELS[type as FileType] ?? 'Arquivo';
}
