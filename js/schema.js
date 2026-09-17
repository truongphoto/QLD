export const TARGET_REGISTER_URL = 'https://csdlduoc.com.vn/auth/register';

export const REGISTRATION_TYPES = [
  {
    id: 'ban_le',
    label: 'Cơ sở bán lẻ',
    description: 'Nhà thuốc hoặc quầy thuốc.',
    manualUploads: [
      'Giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'Chứng chỉ hành nghề',
      'Giấy chứng nhận đăng ký kinh doanh'
    ]
  },
  {
    id: 'ban_buon',
    label: 'Cơ sở bán buôn',
    description: 'Hồ sơ đăng ký tài khoản dành cho cơ sở bán buôn.',
    manualUploads: [
      'Giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'Chứng chỉ hành nghề',
      'Giấy chứng nhận đăng ký kinh doanh'
    ]
  },
  {
    id: 'chuoi_nha_thuoc',
    label: 'Chuỗi nhà thuốc',
    description: 'Hồ sơ đăng ký tài khoản dành cho chuỗi nhà thuốc.',
    manualUploads: [
      'Giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'Chứng chỉ hành nghề',
      'Giấy chứng nhận đăng ký kinh doanh',
      'Giấy chứng nhận đăng ký mã địa điểm kinh doanh'
    ]
  }
];

const COMMON_FIELDS = [
  {
    key: 'province', label: 'Tỉnh / Thành phố', type: 'text', required: true,
    aliases: ['tỉnh/thành phố', 'tỉnh thành phố', 'tỉnh', 'thành phố']
  },
  {
    key: 'district', label: 'Quận / Huyện', type: 'text', required: true, sendToTarget: false,
    aliases: ['quận/huyện', 'quận huyện', 'quận', 'huyện']
  },
  {
    key: 'ward', label: 'Xã / Phường', type: 'text', required: true,
    aliases: ['xã/phường', 'xã phường', 'phường', 'xã']
  },
  {
    key: 'drugBusinessCertificateNumber',
    label: 'Số Giấy chứng nhận',
    type: 'text', required: true,
    aliases: [
      'số giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'số giấy chứng nhận đủ điều kiện sản xuất kinh doanh thuốc',
      'số giấy chứng nhận đủ điều kiện kinh doanh dược'
    ]
  },
  {
    key: 'facilityName', label: 'Tên cơ sở', type: 'text', required: true,
    aliases: ['tên cơ sở']
  },
  {
    key: 'taxCode', label: 'Mã số thuế', type: 'text', required: true,
    aliases: ['mã số thuế']
  },
  {
    key: 'organizationIdentifier', label: 'Số định danh cơ quan, tổ chức', type: 'text',
    help: 'Có thể bỏ qua nếu không có.',
    aliases: ['số định danh cơ quan, tổ chức', 'số định danh cơ quan tổ chức']
  },
  {
    key: 'contactEmail', label: 'Email liên hệ', type: 'email', required: true,
    aliases: ['email liên hệ', 'thư điện tử liên hệ']
  },
  {
    key: 'businessAddress', label: 'Địa chỉ kinh doanh', type: 'text', required: true,
    help: 'Nhập số nhà, tên đường, khóm/ấp.',
    aliases: ['địa chỉ kinh doanh']
  },
  {
    key: 'drugBusinessCertificateIssueDate',
    label: 'Ngày cấp',
    type: 'date', required: true,
    aliases: ['ngày cấp giấy chứng nhận đủ điều kiện kinh doanh dược']
  },
  {
    key: 'drugBusinessCertificateIssuer',
    label: 'Nơi cấp',
    type: 'text', required: true,
    aliases: ['nơi cấp giấy chứng nhận đủ điều kiện kinh doanh dược']
  },
  {
    key: 'responsibleProfessionalName',
    label: 'Họ và tên người chịu trách nhiệm',
    type: 'text', required: true,
    aliases: ['người chịu trách nhiệm chuyên môn về dược của cs', 'người chịu trách nhiệm chuyên môn về dược của cơ sở']
  },
  {
    key: 'contactPhone', label: 'Số điện thoại', type: 'tel', required: true,
    aliases: ['điện thoại liên hệ', 'số điện thoại']
  },
  {
    key: 'qualification', label: 'Trình độ chuyên môn', type: 'text', required: true,
    aliases: ['trình độ chuyên môn']
  },
  {
    key: 'practiceCertificateNumber', label: 'Số chứng chỉ hành nghề', type: 'text', required: true,
    aliases: ['số chứng chỉ hành nghề']
  },
  {
    key: 'practiceCertificateIssueDate', label: 'Ngày cấp CCHN', type: 'date', required: true,
    aliases: ['ngày cấp chứng chỉ hành nghề']
  },
  {
    key: 'practiceCertificateIssuer', label: 'Nơi cấp CCHN', type: 'text', required: true,
    aliases: ['nơi cấp chứng chỉ hành nghề']
  }
];

const RETAIL_ONLY_FIELDS = [
  {
    key: 'facilitySubtype', label: 'Loại hình cơ sở', type: 'select', required: true,
    options: ['Nhà thuốc', 'Quầy thuốc'],
    aliases: ['loại hình cơ sở']
  }
];

const BUSINESS_LOCATION_CHECKBOX = {
  key: 'hasBusinessLocationCode', label: 'Có mã địa điểm kinh doanh', type: 'checkbox',
  aliases: ['có mã địa điểm kinh doanh']
};

const CHAIN_ONLY_FIELDS = [
  {
    key: 'headOfficeAddress', label: 'Địa chỉ trụ sở', type: 'text', required: true,
    aliases: ['địa chỉ trụ sở']
  }
];

function clone(field) {
  return {
    ...field,
    aliases: [...(field.aliases || [])],
    options: field.options ? [...field.options] : undefined
  };
}

export function getFieldsForType(typeId) {
  const common = COMMON_FIELDS.map(clone);
  if (typeId === 'ban_le') {
    const nameIndex = common.findIndex(field => field.key === 'facilityName');
    return [
      ...common.slice(0, nameIndex),
      ...RETAIL_ONLY_FIELDS.map(clone),
      ...common.slice(nameIndex, 6),
      clone(BUSINESS_LOCATION_CHECKBOX),
      ...common.slice(6)
    ];
  }
  if (typeId === 'ban_buon') {
    const orgIndex = common.findIndex(field => field.key === 'organizationIdentifier');
    return [
      ...common.slice(0, orgIndex),
      clone(BUSINESS_LOCATION_CHECKBOX),
      ...common.slice(orgIndex)
    ];
  }
  if (typeId === 'chuoi_nha_thuoc') {
    const addressIndex = common.findIndex(field => field.key === 'businessAddress');
    return [
      ...common.slice(0, addressIndex + 1),
      ...CHAIN_ONLY_FIELDS.map(clone),
      ...common.slice(addressIndex + 1)
    ];
  }
  return [];
}

export function getManualUploadsForType(typeId) {
  return [...(REGISTRATION_TYPES.find(item => item.id === typeId)?.manualUploads || [])];
}

export function getRegistrationType(typeId) {
  return REGISTRATION_TYPES.find(item => item.id === typeId) || REGISTRATION_TYPES[0];
}

export const ALL_FIELDS = [...new Map(
  REGISTRATION_TYPES.flatMap(type => getFieldsForType(type.id)).map(field => [field.key, field])
).values()];

export const FIELD_BY_KEY = Object.fromEntries(ALL_FIELDS.map(field => [field.key, field]));

const FIELD_GROUP_DEFINITIONS = [
  {
    id: 'dinh_danh_co_so',
    label: 'Định danh cơ sở',
    description: 'Nhập thông tin nhận diện cơ bản của cơ sở.',
    keys: ['facilitySubtype', 'facilityName', 'taxCode', 'organizationIdentifier']
  },
  {
    id: 'vi_tri_dia_ly',
    label: 'Vị trí địa lý',
    description: 'Nhập địa chỉ theo thứ tự từ tỉnh/thành phố đến địa chỉ kinh doanh.',
    keys: ['province', 'district', 'ward', 'businessAddress', 'headOfficeAddress']
  },
  {
    id: 'thong_tin_lien_lac',
    label: 'Thông tin liên lạc',
    description: 'Chỉ cần số điện thoại và email đang sử dụng.',
    keys: ['contactPhone', 'contactEmail']
  },
  {
    id: 'giay_chung_nhan_kinh_doanh_duoc',
    label: 'Giấy chứng nhận đủ điều kiện kinh doanh dược',
    description: 'Nhập đúng số, ngày cấp và nơi cấp trên giấy chứng nhận.',
    keys: [
      'drugBusinessCertificateNumber',
      'drugBusinessCertificateIssueDate',
      'drugBusinessCertificateIssuer'
    ]
  },
  {
    id: 'nhan_than_nguoi_phu_trach',
    label: 'Nhân thân người phụ trách chuyên môn',
    description: 'Nhập họ tên và trình độ chuyên môn của người chịu trách nhiệm.',
    keys: ['responsibleProfessionalName', 'qualification']
  },
  {
    id: 'chung_chi_hanh_nghe',
    label: 'Chứng chỉ hành nghề dược (CCHN)',
    description: 'Nhập thông tin chứng chỉ hành nghề dược.',
    keys: [
      'practiceCertificateNumber',
      'practiceCertificateIssueDate',
      'practiceCertificateIssuer'
    ]
  }
];

export function getFieldGroupsForType(typeId) {
  const fields = getFieldsForType(typeId);
  const byKey = new Map(fields.map(field => [field.key, field]));
  return FIELD_GROUP_DEFINITIONS.map(group => ({
    id: group.id,
    label: group.label,
    description: group.description,
    fields: group.keys.filter(key => byKey.has(key)).map(key => byKey.get(key))
  }));
}
