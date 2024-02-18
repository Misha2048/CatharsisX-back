import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  async getFilters(dto: any, blackListKeys: string[] = []) {
    return Object.entries(dto).reduce((filters, [key, value]) => {
      if (value !== undefined && value !== '' && !blackListKeys.includes(key)) {
        if (key === 'stillage') {
          filters[key] = { id: value };
        } else if (key === 'last_upload_at' || key === 'created_at') {
          const dateFrom = new Date(value[0]);
          dateFrom.setHours(0, 0, 0, 0);
          const dateTo = new Date(value[1]);
          dateTo.setDate(dateTo.getDate() + 1);
          dateTo.setHours(0, 0, 0, 0);
          filters[key] = { gte: dateFrom, lt: dateTo };
        } else if (key === 'name') {
          filters[key] = { contains: value, mode: 'insensitive' };
        } else {
          filters[key] = { contains: value, mode: 'insensitive' };
        }
      }
      return filters;
    }, {});
  }

  async getContentType(filename: string) {
    const extension = filename
      .substring(filename.lastIndexOf('.'))
      .toLowerCase();
    const filesExtensions: { [key: string]: string } = {
      '.txt': 'text/plain',
      '.rtf': 'application/rtf',
      '.pdf': 'application/pdf',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.pptx':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.xlsx':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return filesExtensions[extension];
  }
}
