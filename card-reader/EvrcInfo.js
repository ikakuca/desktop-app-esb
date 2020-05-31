const VEHICLE_TAGS = {
  '71.82': 'first_registration_date',
  '72.C5': 'production_year',
  '71.A3.87': 'make',
  '71.A3.88': 'type',
  '71.A3.89': 'commercial_description',
  '71.8A': 'id_number',
  '71.81': 'registration_number',
  '71.A5.91': 'max_net_power',
  '71.A5.90': 'engine_capacity',
  '71.A5.92': 'fuel_type',
  '71.93': 'power_weight_ratio',
  '71.8C': 'mass',
  '71.A4.8B': 'max_permissible_laden_mass',
  '71.8F': 'type_approval_number',
  '71.A6.94': 'seats_number',
  '71.A6.95': 'standing_places_number',
  '72.A5.9E': 'engine_id_number',
  '72.99': 'axies_number',
  '72.98': 'vehicle_category',
  '72.9F24': 'color',
  '72.C1': 'owner_change_restriction',
  '72.C4': 'load'
};

const DOCUMENT_TAGS = {
  '71.9F33': 'issuing_state',
  '71.9F35': 'competent_authority',
  '71.9F36': 'issuing_authority',
  '71.9F38': 'unambiguous_number',
  '71.8E': 'issuing_date',
  '71.8D': 'expiry_date',
  '72.C9': 'serial_number'
};

const PERSONAL_TAGS = {
  '72.C2': 'owner_personalno',
  '71.A1.A2.83': 'owner_legal_name',
  '71.A1.A2.84': 'owner_first_name',
  '71.A1.A2.85': 'owner_address',
  '72.C3': 'user_personalno',
  '72.A1.A9.83': 'user_legal_name',
  '72.A1.A9.84': 'user_first_name',
  '72.A1.A9.85': 'user_address'
};

module.exports = {
  VEHICLE_TAGS,
  DOCUMENT_TAGS,
  PERSONAL_TAGS
};
