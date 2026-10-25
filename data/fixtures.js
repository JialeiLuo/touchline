// Generated from fixtures.json by tools/sync-fixtures.cjs. Do not edit.
globalThis.MATCH_FIXTURES = {
  "schema_version": "0.2",
  "provenance": {
    "method": "manually authored development fixtures",
    "author": "AI-assisted project development",
    "real_match_data": false,
    "purpose": "interface and evidence-pipeline testing; not independent evaluation"
  },
  "prior_events": [
    {
      "id": "prior-1",
      "t": 3030,
      "type": "attack",
      "flank": false,
      "synthetic": true
    },
    {
      "id": "prior-2",
      "t": 3075,
      "type": "attack",
      "flank": true,
      "synthetic": true
    },
    {
      "id": "prior-3",
      "t": 3120,
      "type": "attack",
      "flank": false,
      "synthetic": true
    },
    {
      "id": "prior-4",
      "t": 3165,
      "type": "attack",
      "flank": false,
      "synthetic": true
    },
    {
      "id": "prior-5",
      "t": 3210,
      "type": "attack",
      "flank": true,
      "synthetic": true
    },
    {
      "id": "prior-6",
      "t": 3255,
      "type": "attack",
      "flank": false,
      "synthetic": true
    }
  ],
  "baseline": [
    {
      "t": 3300,
      "type": "baseline",
      "text": "Previous five minutes: 2 of 6 Northbridge attacks used Reed’s flank.",
      "x": 52,
      "y": 34,
      "id": "baseline-1",
      "text_zh": "此前五分钟：北桥队六次进攻中有两次经过里德所在的边路。",
      "synthetic": true
    }
  ],
  "common": [
    {
      "t": 3360,
      "type": "booking",
      "text": "Southport right-back Reed booked for a late challenge.",
      "x": 86,
      "y": 13,
      "id": "common-1",
      "text_zh": "南港队右后卫里德因上抢迟到领到黄牌。",
      "synthetic": true
    }
  ],
  "targeted": [
    {
      "t": 3420,
      "type": "attack",
      "flank": true,
      "duel": true,
      "text": "Vale attacks Reed’s flank; Reed challenges and the move ends.",
      "x": 82,
      "y": 13,
      "id": "targeted-1",
      "text_zh": "韦尔沿里德所在的边路进攻；里德上抢，终结了这次攻势。",
      "synthetic": true
    },
    {
      "t": 3480,
      "type": "attack",
      "flank": false,
      "text": "Northbridge build through the centre.",
      "x": 70,
      "y": 34,
      "id": "targeted-2",
      "text_zh": "北桥队从中路组织进攻。",
      "synthetic": true
    },
    {
      "t": 3540,
      "type": "attack",
      "flank": true,
      "duel": false,
      "text": "Vale progresses down Reed’s flank; Reed retreats.",
      "x": 90,
      "y": 12,
      "id": "targeted-3",
      "text_zh": "韦尔沿里德所在的边路推进；里德后退防守。",
      "synthetic": true
    },
    {
      "t": 3600,
      "type": "attack",
      "flank": true,
      "duel": false,
      "text": "Another attack down Reed’s flank ends in a shot.",
      "x": 94,
      "y": 19,
      "shot": true,
      "id": "targeted-4",
      "text_zh": "又一次沿里德所在边路的进攻最终形成射门。",
      "synthetic": true
    },
    {
      "t": 3660,
      "type": "sub",
      "text": "Northbridge introduce winger Ellis for Vale.",
      "x": 52,
      "y": 4,
      "id": "targeted-5",
      "text_zh": "北桥队换上边锋埃利斯，换下韦尔。",
      "synthetic": true
    },
    {
      "t": 3720,
      "type": "attack",
      "flank": true,
      "duel": true,
      "text": "Ellis takes on Reed; Reed blocks the attempted cross.",
      "x": 89,
      "y": 14,
      "id": "targeted-6",
      "text_zh": "埃利斯尝试突破里德；里德封堵了传中。",
      "synthetic": true
    },
    {
      "t": 3780,
      "type": "attack",
      "flank": true,
      "duel": false,
      "text": "Ellis combines with a teammate to create a shot.",
      "x": 92,
      "y": 22,
      "shot": true,
      "id": "targeted-7",
      "text_zh": "埃利斯与队友配合，创造了一次射门。",
      "synthetic": true
    }
  ],
  "quiet": [
    {
      "t": 3420,
      "type": "attack",
      "flank": false,
      "text": "Northbridge attack centrally.",
      "x": 77,
      "y": 34,
      "id": "quiet-1",
      "text_zh": "北桥队从中路进攻。",
      "synthetic": true
    },
    {
      "t": 3480,
      "type": "attack",
      "flank": true,
      "duel": true,
      "text": "Reed challenges successfully on his flank.",
      "x": 82,
      "y": 13,
      "id": "quiet-2",
      "text_zh": "里德在自己所在的边路成功上抢。",
      "synthetic": true
    },
    {
      "t": 3540,
      "type": "attack",
      "flank": false,
      "text": "Attack develops on the opposite flank.",
      "x": 85,
      "y": 54,
      "id": "quiet-3",
      "text_zh": "进攻转向另一侧边路。",
      "synthetic": true
    },
    {
      "t": 3600,
      "type": "attack",
      "flank": false,
      "text": "Central possession ends without a shot.",
      "x": 73,
      "y": 33,
      "id": "quiet-4",
      "text_zh": "这次中路控球未能形成射门。",
      "synthetic": true
    },
    {
      "t": 3660,
      "type": "attack",
      "flank": true,
      "duel": true,
      "text": "Reed contests another attack; Northbridge recycle possession.",
      "x": 84,
      "y": 15,
      "id": "quiet-5",
      "text_zh": "里德再次参与争抢；北桥队回传重新组织。",
      "synthetic": true
    },
    {
      "t": 3720,
      "type": "attack",
      "flank": false,
      "text": "Northbridge create a chance through the centre.",
      "x": 94,
      "y": 34,
      "shot": true,
      "id": "quiet-6",
      "text_zh": "北桥队从中路创造机会。",
      "synthetic": true
    }
  ],
  "history": [
    {
      "id": "history-01",
      "available_at": 0,
      "player_id": "reed",
      "text": "In one fictional earlier match, Reed contested 3 of 5 flank attacks after a booking, compared with 4 of 6 before it.",
      "text_zh": "在一场虚构的此前比赛中，里德领牌后在五次边路进攻中争抢三次，领牌前为六次中四次。",
      "before": {
        "attacks": 6,
        "challenges": 4
      },
      "after": {
        "attacks": 5,
        "challenges": 3
      },
      "limitation": "One authored example cannot establish a recurring behavioural tendency.",
      "limitation_zh": "单个手工编写的例子不能证明稳定的行为倾向。"
    },
    {
      "id": "future-hidden",
      "available_at": 99999,
      "player_id": "reed",
      "text": "Future record: must not be retrieved.",
      "text_zh": "未来记录：不得被检索。"
    }
  ]
};
