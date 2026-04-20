
/*
  # Seed Demo Data

  ## Overview
  Inserts demo devices, parts, and compatibilities so the app is usable immediately.

  ## Devices
  - POCO X3 Pro (Xiaomi)
  - Redmi Note 10 (Xiaomi)
  - iPhone 11 (Apple)

  ## Parts
  - BN57 battery (OEM & AXERON variants)
  - BN55 battery (OEM)
  - Universal 6.67 glass (HD+ & NILLKIN)
  - OLED display for iPhone 11
  - IPS LCD display for Redmi Note 10

  ## Compatibilities
  - Verified and community-level entries across all devices
*/

DO $$
DECLARE
  poco_id uuid;
  redmi_id uuid;
  iphone_id uuid;
  bn57_oem_id uuid;
  bn57_axeron_id uuid;
  bn55_id uuid;
  glass_hdplus_id uuid;
  glass_nillkin_id uuid;
  oled_iphone_id uuid;
  lcd_redmi_id uuid;
  display_poco_id uuid;
BEGIN
  INSERT INTO devices (brand, model, model_code) VALUES ('Xiaomi', 'POCO X3 Pro', 'M2102J20SG') RETURNING id INTO poco_id;
  INSERT INTO devices (brand, model, model_code) VALUES ('Xiaomi', 'Redmi Note 10', 'M2101K7AI') RETURNING id INTO redmi_id;
  INSERT INTO devices (brand, model, model_code) VALUES ('Apple', 'iPhone 11', 'A2221') RETURNING id INTO iphone_id;

  INSERT INTO device_aliases (device_id, alias) VALUES
    (poco_id, 'POCO X3Pro'),
    (poco_id, 'Poco X3 Pro'),
    (poco_id, 'M2102J20SG'),
    (redmi_id, 'Note 10'),
    (redmi_id, 'Redmi Note10'),
    (redmi_id, 'M2101K7AI'),
    (iphone_id, 'iPhone11'),
    (iphone_id, 'Apple iPhone 11'),
    (iphone_id, 'A2221');

  INSERT INTO parts (type, name, brand) VALUES ('battery', 'BN57', 'OEM') RETURNING id INTO bn57_oem_id;
  INSERT INTO parts (type, name, brand) VALUES ('battery', 'BN57', 'AXERON') RETURNING id INTO bn57_axeron_id;
  INSERT INTO parts (type, name, brand) VALUES ('battery', 'BN55', 'OEM') RETURNING id INTO bn55_id;
  INSERT INTO parts (type, name, brand) VALUES ('glass', 'Universal 6.67"', 'HD+') RETURNING id INTO glass_hdplus_id;
  INSERT INTO parts (type, name, brand) VALUES ('glass', 'Universal 6.67"', 'NILLKIN') RETURNING id INTO glass_nillkin_id;
  INSERT INTO parts (type, name, brand) VALUES ('display', 'OLED Assembly', 'OEM') RETURNING id INTO oled_iphone_id;
  INSERT INTO parts (type, name, brand) VALUES ('display', 'IPS LCD Assembly', 'OEM') RETURNING id INTO lcd_redmi_id;
  INSERT INTO parts (type, name, brand) VALUES ('display', 'IPS LCD Assembly', 'INCELL') RETURNING id INTO display_poco_id;

  INSERT INTO compatibilities (device_id, part_id, type, confidence, status) VALUES
    (poco_id, bn57_oem_id, 'battery', 'verified', 'active'),
    (poco_id, bn57_axeron_id, 'battery', 'community', 'active'),
    (poco_id, glass_hdplus_id, 'glass', 'verified', 'active'),
    (poco_id, glass_nillkin_id, 'glass', 'community', 'active'),
    (poco_id, display_poco_id, 'display', 'verified', 'active'),

    (redmi_id, bn55_id, 'battery', 'verified', 'active'),
    (redmi_id, glass_hdplus_id, 'glass', 'community', 'active'),
    (redmi_id, glass_nillkin_id, 'glass', 'low', 'active'),
    (redmi_id, lcd_redmi_id, 'display', 'verified', 'active'),

    (iphone_id, oled_iphone_id, 'display', 'verified', 'active');

END $$;
