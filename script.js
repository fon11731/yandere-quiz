(function () {
  "use strict";

  /* =========================================================
     提交配置（部署前必改！）
     ========================================================= */
  const SUPABASE_URL = "https://vrjtpuktwycvzbfbtmvv.supabase.co"; // ← 替换为你的 Project URL
  const SUPABASE_ANON_KEY = "sb_publishable_6XJKVene4ij4dpKv0ugT0g_u6vZaHia"; // ← 替换为你的 anon key
  const TABLE = "responses";
  const QUIZ_VERSION = "1.0";

  /* =========================================================
     九种依赖类型
     ========================================================= */
  const TYPES = [
    {
      key: "yicun",
      name: "依存型",
      tag: "没有你，我好像就活不下去",
      desc: "你的爱是“生存必需品”。离开对方你不仅会痛苦，更会觉得整个人失去支点。你容易用示弱、黏附、反复确认来证明自己还被需要。",
    },
    {
      key: "duzhan",
      name: "独占型",
      tag: "你只能属于我",
      desc: "你要的不是“喜欢”，而是“唯一”。任何分享对方注意力的存在都会让你感到被侵犯。你可能会用规则、监控或情感压力，来确保自己不可替代。",
    },
    {
      key: "paichu",
      name: "排除型",
      tag: "任何可能靠近你的人，都应该消失",
      desc: "你清除的是“可能性”。对你来说，只要某个人可能吸引对方，即使什么都还没发生，那个人就已经构成了威胁。你的安全感建立在“没有别人”之上。",
    },
    {
      key: "gongji",
      name: "攻击型",
      tag: "你让我不安，我就要你记住",
      desc: "你的不安会转化为指向对方的“惩罚”。当对方让你感到失控，你会用冷暴力、指责或更激烈的方式，让对方“记住教训”——你真正想要的，其实是被看见。",
    },
    {
      key: "genzong",
      name: "跟踪型",
      tag: "知道你的全部，我才觉得安全",
      desc: "你通过“全知”来获得安全感。对方的行程、联系人、情绪变化，你都想掌握。知道一切让你暂时安心，但知道越多，想知道的也越多。",
    },
    {
      key: "wuhai",
      name: "无害型",
      tag: "我不伤害你，我只伤害自己",
      desc: "你把刀口朝向自己。你不攻击对方，而是用自我伤害、自我贬低或过度付出来让对方无法离开你。你的武器是愧疚，而你自己也困在其中。",
    },
    {
      key: "chongbai",
      name: "崇拜型",
      tag: "你是神，我存在的意义就是为你所用",
      desc: "你把对方放在神坛上，把自己放在工具的位置。你通过“被使用”来确认自己的价值，但一旦对方不再需要你，你的存在感就会整体崩塌。",
    },
    {
      key: "wangxiang",
      name: "妄想型",
      tag: "我们的关系，比现实更早开始",
      desc: "你的爱情有很大一部分发生在脑海里。你会把零散的互动编织成完整的故事，并且渐渐分不清哪些是真实发生的，哪些是你希望发生的。",
    },
    {
      key: "guli",
      name: "孤立诱导型",
      tag: "你身边只剩我，就只能依赖我",
      desc: "你不直接攻击别人，而是通过信息差、舆论或情感引导，让对方的世界慢慢缩小到只剩你。你相信“只要 ta 只有我，ta 就会需要我”。",
    },
  ];

  /* =========================================================
     题库：18 题
     ========================================================= */
  const QUESTIONS = [
    {
      q: "对方超过三小时没有回消息，你最先冒出的念头是：",
      opts: [
        { t: "是不是我哪里做错了，ta 会不会不要我了", k: ["yizon"] },
        { t: "ta 在跟谁在一起？为什么不回我", k: ["genzong", "dukuzhan"] },
        { t: "等 ta 出现，我要让 ta 知道不联系我的后果", k: ["gongji"] },
        {
          t: "也许 ta 已经和别人开始了新的生活，而我还在原地",
          k: ["wangxiang", "wuhai"],
        },
      ],
    },
    {
      q: "你发现对方有一个关系不错的异性朋友，你的第一反应是：",
      opts: [
        { t: "那个人最好自己消失，否则我不确定我会做什么", k: ["paichu"] },
        {
          t: "我要让 ta 知道，那个人不适合 ta，只有我才是真正为 ta 好",
          k: ["guli"],
        },
        {
          t: "我会对 ta 更好，好到 ta 再也不想看别人一眼",
          k: ["chongbai", "yizon"],
        },
        { t: "他们之间一定有什么，我脑子里已经有画面了", k: ["wangxiang"] },
      ],
    },
    {
      q: "对方夸了别人一句“挺好看的”，你：",
      opts: [
        {
          t: "表面没事，心里已经在想怎么让那个人不再出现在 ta 视线里",
          k: ["paichu"],
        },
        { t: "立刻问“那我呢？我好看吗？你还喜欢我吗？”", k: ["yizon"] },
        {
          t: "笑着说“是吗”，但心里记下了，之后会找机会“提醒”ta 谁才是最重要的",
          k: ["gongji", "dukuzhan"],
        },
        { t: "觉得 ta 是不是在暗示对我哪里不满意", k: ["wangxiang", "wuhai"] },
      ],
    },
    {
      q: "你更接受哪一种“爱的方式”？",
      opts: [
        { t: "我所有的一切都围绕 ta 运转，ta 是我活着的理由", k: ["yizon"] },
        {
          t: "我知道 ta 的一切行程、联系人、密码，这样我才安心",
          k: ["genzong"],
        },
        { t: "我愿意为 ta 做任何事，ta 可以尽情使用我", k: ["chongbai"] },
        { t: "我会让 ta 慢慢发现，除了我，没有人真正理解 ta", k: ["guli"] },
      ],
    },
    {
      q: "如果对方提出“我们需要一点个人空间”，你会：",
      opts: [
        {
          t: "嘴上答应，但心里像被撕开一样，忍不住一直想这件事",
          k: ["yizon", "wuhai"],
        },
        {
          t: "怀疑 ta 是不是有了别人，开始想检查 ta 的手机",
          k: ["genzong", "dukuzhan"],
        },
        {
          t: "觉得 ta 在推开我，那我就要让 ta 更清楚地感受到我的存在",
          k: ["gongji"],
        },
        { t: "认为这是别人教 ta 说的，ta 本来不会这样", k: ["wangxiang"] },
      ],
    },
    {
      q: "你最容易在哪一种情况下失控？",
      opts: [
        {
          t: "对方长时间不在我身边，我不知道 ta 在做什么",
          k: ["genzong", "yizon"],
        },
        {
          t: "有人明显对 ta 表示好感，而 ta 没有明确拒绝",
          k: ["paichu", "dukuzhan"],
        },
        { t: "对方用冷淡的语气跟我说话", k: ["gongji", "wuhai"] },
        { t: "我发现自己并不是 ta 世界的中心", k: ["chongbai", "guli"] },
      ],
    },
    {
      q: "你做过、或可能会做的“越界”行为是：",
      opts: [
        {
          t: "反复翻看 ta 的社交动态，甚至找到 ta 朋友的账号去看",
          k: ["genzong"],
        },
        { t: "用自伤或示弱的方式，让 ta 无法离开我", k: ["wuhai"] },
        { t: "在 ta 面前说别人的不好，让 ta 渐渐只信任我", k: ["guli"] },
        {
          t: "在心里已经和 ta 经历了完整的恋爱剧情，即使现实中还没开始",
          k: ["wangxiang"],
        },
      ],
    },
    {
      q: "对方受伤或生病时，你的第一反应更接近：",
      opts: [
        { t: "太好了，这样 ta 就需要我了", k: ["yizon", "dukuzhan"] },
        { t: "我要把 ta 照顾到再也离不开我的照顾", k: ["chongbai", "guli"] },
        {
          t: "是谁让 ta 变成这样的？我要让那个人付出代价",
          k: ["paichu", "gongji"],
        },
        {
          t: "我会责怪自己没有保护好 ta，甚至想用同样的方式伤害自己",
          k: ["wuhai"],
        },
      ],
    },
    {
      q: "你如何看待“嫉妒”？",
      opts: [
        { t: "嫉妒是因为我太爱 ta 了，没有 ta 我什么都不是", k: ["yizon"] },
        {
          t: "嫉妒让我想确认 ta 的一切，这样我才能停止想象",
          k: ["genzong", "wangxiang"],
        },
        {
          t: "嫉妒的时候我会想让 ta 也不舒服，这样 ta 才会注意我",
          k: ["gongji"],
        },
        { t: "嫉妒是因为有人试图抢走属于我的位置", k: ["dukuzhan", "paichu"] },
      ],
    },
    {
      q: "你更害怕哪一种结局？",
      opts: [
        { t: "ta 离开我，而我一个人活不下去", k: ["yizon"] },
        { t: "ta 身边有了别人，而我被慢慢遗忘", k: ["dukuzhan", "paichu"] },
        { t: "ta 觉得我“太过了”，然后疏远我", k: ["gongji", "wuhai"] },
        {
          t: "ta 发现我脑海里那些关于我们的“故事”并不是真的",
          k: ["wangxiang"],
        },
      ],
    },
    {
      q: "对方说“你对我太好了，我不知道怎么回报”，你会：",
      opts: [
        { t: "不需要回报，你只要让我留在你身边就好", k: ["yizon", "chongbai"] },
        { t: "那就用你的一辈子来回报，只看着我一个人", k: ["dukuzhan"] },
        {
          t: "你知道就好，所以不要离开我，否则我也不知道自己会怎样",
          k: ["gongji", "wuhai"],
        },
        { t: "你终于意识到了，这个世界上只有我对你是真心的", k: ["guli"] },
      ],
    },
    {
      q: "你更容易在什么情况下产生“病娇式”的念头？",
      opts: [
        {
          t: "深夜一个人，反复回想 ta 今天说过的每一句话",
          k: ["wangxiang", "yizon"],
        },
        { t: "看到 ta 和别人走得很近", k: ["paichu", "gongji"] },
        { t: "觉得自己不够好，担心 ta 会发现我“没那么值得爱”", k: ["wuhai"] },
        { t: "发现 ta 有事情瞒着我", k: ["genzong", "dukuzhan"] },
      ],
    },
    {
      q: "如果必须选一种方式“绑住”对方，你会选：",
      opts: [
        {
          t: "让 ta 习惯我的存在，习惯到没有我就活不下去",
          k: ["yizon", "guli"],
        },
        {
          t: "让 ta 知道，任何靠近 ta 的人都会有后果",
          k: ["paichu", "dukuzhan"],
        },
        {
          t: "让 ta 觉得，只有我能给 ta 最好的爱和照顾",
          k: ["chongbai", "genzong"],
        },
        {
          t: "让 ta 相信，我们之间的羁绊是命中注定的，比现实更真实",
          k: ["wangxiang"],
        },
      ],
    },
    {
      q: "你内心最深处的那句话更接近：",
      opts: [
        { t: "“请不要丢下我。”", k: ["yizon"] },
        { t: "“你只能看着我。”", k: ["dukuzhan", "paichu"] },
        { t: "“如果你不看我，我就让你不得不看我。”", k: ["gongji"] },
        {
          t: "“我可以为你死，但你也要记住是我为你死的。”",
          k: ["wuhai", "chongbai"],
        },
      ],
    },
    {
      q: "对方和你说“我觉得你有点太依赖我了”，你：",
      opts: [
        { t: "承认，并且觉得这没什么不对，依赖是因为信任", k: ["yizon"] },
        { t: "不承认，但之后会更隐蔽地掌握 ta 的动态", k: ["genzong"] },
        { t: "有点受伤，觉得 ta 在否定你的爱", k: ["wuhai", "chongbai"] },
        {
          t: "觉得 ta 一定是被别人影响了，才会说出这种话",
          k: ["wangxiang", "guli"],
        },
      ],
    },
    {
      q: "你更容易对哪一种人产生病娇式依恋？",
      opts: [
        {
          t: "温柔但有些疏离的人，你会拼命想成为 ta 的唯一",
          k: ["yizon", "dukuzhan"],
        },
        {
          t: "受欢迎的人，你会想成为那个“打败所有人”的存在",
          k: ["paichu", "gongji"],
        },
        {
          t: "脆弱的人，你会想成为 ta 的拯救者和唯一依靠",
          k: ["chongbai", "guli"],
        },
        {
          t: "给你一点温暖就让你反复回味的人，你会在脑海里和 ta 过完一生",
          k: ["wangxiang"],
        },
      ],
    },
    {
      q: "你如何理解“占有”？",
      opts: [
        {
          t: "占有不是控制，是我把我全部交给 ta，ta 也把全部交给我",
          k: ["yizon", "dukuzhan"],
        },
        {
          t: "占有就是知道 ta 的一切，并且确保没有其他人能介入",
          k: ["genzong", "paichu"],
        },
        {
          t: "占有是让 ta 心甘情愿只看着我，即使需要一些“手段”",
          k: ["gongji", "guli"],
        },
        {
          t: "占有是成为 ta 心中不可替代的存在，哪怕以伤害自己为代价",
          k: ["wuhai", "chongbai"],
        },
      ],
    },
    {
      q: "最后，选一句最像你“病娇式依赖”内核的话：",
      opts: [
        { t: "“没有你，我活不下去。”", k: ["yizon"] },
        { t: "“你的一切，都应该是我的。”", k: ["dukuzhan", "genzong"] },
        { t: "“任何想靠近你的人，都是我的敌人。”", k: ["paichu", "gongji"] },
        {
          t: "“我会让你明白，只有我才是真正爱你的人。”",
          k: ["chongbai", "guli", "wangxiang", "wuhai"],
        },
      ],
    },
  ];

  /* =========================================================
     状态
     ========================================================= */
  let idx = 0;
  let answers = new Array(QUESTIONS.length).fill(null);
  let locked = false;
  let startTs = Date.now();
  let timings = new Array(QUESTIONS.length).fill(null);
  let questionShownAt = 0;

  /* =========================================================
     DOM
     ========================================================= */
  const $ = function (s) {
    return document.querySelector(s);
  };

  const screens = {
    cover: $("#screen-cover"),
    quiz: $("#screen-quiz"),
    result: $("#screen-result"),
  };

  const startBtn = $("#startBtn");
  const restartBtn = $("#restartBtn");
  const qnum = $("#qnum");
  const progressBar = $("#progressBar");
  const qCard = $("#qCard");
  const qText = $("#qText");
  const optsEl = $("#opts");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const resName = $("#resName");
  const resTag = $("#resTag");
  const resDesc = $("#resDesc");
  const chartEl = $("#chart");
  const intValue = $("#intValue");
  const intDesc = $("#intDesc");
  const tagsEl = $("#tags");
  const resultInner = $("#resultInner");

  const LETTERS = ["A", "B", "C", "D"];

  /* =========================================================
     屏幕切换
     ========================================================= */
  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle("active", k === name);
    });
    document.querySelectorAll(".screen.active").forEach(function (el) {
      el.scrollTop = 0;
    });
  }

  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  /* =========================================================
     问卷渲染
     ========================================================= */
  function renderQuestion() {
    const q = QUESTIONS[idx];

    qnum.textContent = pad2(idx + 1) + " / " + pad2(QUESTIONS.length);
    progressBar.style.width = ((idx + 1) / QUESTIONS.length) * 100 + "%";
    qText.textContent = q.q;

    optsEl.innerHTML = q.opts
      .map(function (o, i) {
        const sel = answers[idx] === i ? " selected" : "";
        return (
          '<button type="button" class="opt' +
          sel +
          '" data-i="' +
          i +
          '">' +
          '<span class="key">' +
          LETTERS[i] +
          "</span>" +
          '<span class="txt">' +
          o.t +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    optsEl.querySelectorAll(".opt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectOption(parseInt(btn.dataset.i, 10));
      });
    });

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = answers[idx] === null;
    nextBtn.textContent = idx === QUESTIONS.length - 1 ? "查看结果" : "下一题";

    qCard.classList.remove("anim-in");
    void qCard.offsetWidth;
    qCard.classList.add("anim-in");

    questionShownAt = performance.now();
  }

  function selectOption(i) {
    if (locked) return;

    answers[idx] = i;
    timings[idx] = Math.round(performance.now() - questionShownAt);

    optsEl.querySelectorAll(".opt").forEach(function (b, j) {
      b.classList.toggle("selected", j === i);
    });
    nextBtn.disabled = false;

    if (idx < QUESTIONS.length - 1) {
      locked = true;
      setTimeout(function () {
        locked = false;
        idx++;
        renderQuestion();
      }, 320);
    }
  }

  function goNext() {
    if (answers[idx] === null) return;
    if (idx < QUESTIONS.length - 1) {
      idx++;
      renderQuestion();
    } else {
      showResult();
    }
  }

  function goPrev() {
    if (locked) return;
    if (idx > 0) {
      idx--;
      renderQuestion();
    }
  }

  /* =========================================================
     计分
     ========================================================= */
  function computeScores() {
    const scores = {};
    TYPES.forEach(function (t) {
      scores[t.key] = 0;
    });

    answers.forEach(function (sel, qi) {
      if (sel === null) return;
      const keys = QUESTIONS[qi].opts[sel].k;
      const w = 1 / keys.length;
      keys.forEach(function (k) {
        scores[k] += w;
      });
    });

    return scores;
  }

  /* =========================================================
     乱答检测
     ========================================================= */
  const Q = {
    FAST_MS: 900,
    AVG_FAST_MS: 1000,
    FAST_RATIO: 0.6,
    STREAK: 6,
    DOMINANT_RATIO: 0.65,
    ENTROPY_MIN: 1.0,
    TOTAL_FAST_MS: 20000,
    SUSPICIOUS_SCORE: 55,
  };

  function assessQuality(timings, answers) {
    const n = answers.length;
    const valid = timings.filter(function (t) {
      return typeof t === "number" && t >= 0;
    });
    const totalMs = valid.reduce(function (a, b) {
      return a + b;
    }, 0);
    const avgMs = valid.length ? totalMs / valid.length : 0;

    const fastCount = valid.filter(function (t) {
      return t < Q.FAST_MS;
    }).length;
    const fastRatio = valid.length ? fastCount / valid.length : 0;

    let maxStreak = 1,
      streak = 1;
    for (let i = 1; i < n; i++) {
      if (answers[i] !== null && answers[i] === answers[i - 1]) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }

    const counts = [0, 0, 0, 0];
    answers.forEach(function (a) {
      if (a !== null && a < 4) counts[a]++;
    });
    const answered =
      answers.filter(function (a) {
        return a !== null;
      }).length || 1;
    const dominantRatio = Math.max.apply(null, counts) / answered;

    let entropy = 0;
    counts.forEach(function (c) {
      if (c > 0) {
        const p = c / answered;
        entropy -= p * Math.log2(p);
      }
    });

    const flags = [];
    if (avgMs > 0 && avgMs < Q.AVG_FAST_MS) flags.push("avg_too_fast");
    if (fastRatio > Q.FAST_RATIO) flags.push("many_fast");
    if (maxStreak >= Q.STREAK) flags.push("straight_line");
    if (dominantRatio > Q.DOMINANT_RATIO) flags.push("dominant_position");
    if (entropy < Q.ENTROPY_MIN) flags.push("low_entropy");
    if (totalMs < Q.TOTAL_FAST_MS) flags.push("total_too_fast");

    let score = 100;
    if (flags.indexOf("avg_too_fast") !== -1) score -= 25;
    if (flags.indexOf("many_fast") !== -1) score -= 20;
    if (flags.indexOf("straight_line") !== -1) score -= 25;
    if (flags.indexOf("dominant_position") !== -1) score -= 15;
    if (flags.indexOf("low_entropy") !== -1) score -= 15;
    if (flags.indexOf("total_too_fast") !== -1) score -= 20;
    score = Math.max(0, Math.min(100, score));

    const suspicious =
      score < Q.SUSPICIOUS_SCORE ||
      flags.indexOf("straight_line") !== -1 ||
      flags.indexOf("many_fast") !== -1;

    return {
      suspicious: suspicious,
      score: score,
      flags: flags,
      avgMs: Math.round(avgMs),
      fastRatio: Math.round(fastRatio * 100) / 100,
      maxStreak: maxStreak,
      dominantRatio: Math.round(dominantRatio * 100) / 100,
      entropy: Math.round(entropy * 100) / 100,
      totalMs: Math.round(totalMs),
    };
  }

  /* =========================================================
     提交到 Supabase
     ========================================================= */
  async function submitResult(payload) {
    const el = document.getElementById("submitStatus");
    if (el) el.textContent = "正在记录结果…";

    try {
      const res = await fetch(SUPABASE_URL + "/rest/v1/" + TABLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          version: payload.version,
          top_type: payload.topType,
          intensity: payload.intensity,
          scores: payload.scores,
          answers: payload.answers,
          duration_ms: payload.durationMs,
          timings: payload.timings,
          quality_score: payload.quality.score,
          suspicious: payload.quality.suspicious,
          quality_flags: payload.quality.flags,
          total_ms: payload.quality.totalMs,
          avg_ms: payload.quality.avgMs,
        }),
        keepalive: true,
      });

      if (!res.ok) throw new Error("HTTP " + res.status);
      if (el) el.textContent = "结果已匿名记录。";
    } catch (err) {
      console.warn("[quiz] submit failed:", err);
      if (el) el.textContent = "结果未能上传（不影响本地查看）。";
    }
  }

  /* =========================================================
     结果页
     ========================================================= */
  function showResult() {
    const scores = computeScores();
    const answered =
      answers.filter(function (a) {
        return a !== null;
      }).length || 1;

    const ranked = TYPES.map(function (t, i) {
      return { type: t, score: scores[t.key], order: i };
    }).sort(function (a, b) {
      return b.score - a.score || a.order - b.order;
    });

    const top = ranked[0].type;

    resName.textContent = top.name;
    resTag.textContent = "“" + top.tag + "”";
    resDesc.textContent = top.desc;

    const maxScore = ranked[0].score || 1;
    chartEl.innerHTML = ranked
      .map(function (item) {
        const pct = Math.round((item.score / answered) * 100);
        const w =
          item.score > 0 ? Math.max((item.score / maxScore) * 100, 3) : 0;
        const isTop = item.type.key === top.key ? " top" : "";
        return (
          '<div class="bar-row' +
          isTop +
          '">' +
          '<span class="bar-name">' +
          item.type.name +
          "</span>" +
          '<div class="bar-track">' +
          '<div class="bar-fill" data-w="' +
          w.toFixed(1) +
          '"></div>' +
          "</div>" +
          '<span class="bar-val">' +
          pct +
          "%</span>" +
          "</div>"
        );
      })
      .join("");

    requestAnimationFrame(function () {
      chartEl.querySelectorAll(".bar-fill").forEach(function (el, i) {
        setTimeout(
          function () {
            el.style.width = el.dataset.w + "%";
          },
          120 + i * 70,
        );
      });
    });

    const top3Sum = ranked.slice(0, 3).reduce(function (s, x) {
      return s + x.score;
    }, 0);
    const ratio = top3Sum / answered;
    let level, levelDesc;
    if (ratio < 0.46) {
      level = "轻度";
      levelDesc =
        "依赖倾向确实存在，但你仍保有相当的现实检验能力。关系中的边界大体清晰，偶尔的黏附与不安不至于主导你的判断。";
    } else if (ratio < 0.6) {
      level = "中度";
      levelDesc =
        "依赖已经成为你关系中的主导逻辑，可能带来反复的焦虑、试探与冲突。你清楚地知道自己“太在意了”，却很难在当下停下来。";
    } else {
      level = "高度";
      levelDesc =
        "多种依赖模式同时处于高位，依恋带有明显的强迫性。你的注意力被大量卷入“对方是否还属于我”这件事上，建议有意识地练习建立关系边界，并在需要时寻求专业支持。";
    }
    intValue.textContent = level;
    intDesc.textContent = levelDesc;

    const rest = ranked.slice(1, 4).filter(function (x) {
      return x.score > 0;
    });
    tagsEl.innerHTML = rest.length
      ? rest
          .map(function (x) {
            return (
              '<span class="tag"><b>' +
              x.type.name +
              "</b> " +
              Math.round((x.score / answered) * 100) +
              "%</span>"
            );
          })
          .join("")
      : '<span class="tag">没有明显的次要倾向</span>';

    resultInner.classList.remove("anim-in");
    void resultInner.offsetWidth;
    resultInner.classList.add("anim-in");

    const quality = assessQuality(timings, answers);
    const qualityNote = document.getElementById("qualityNote");
    if (qualityNote) {
      if (quality.suspicious) {
        qualityNote.hidden = false;
        qualityNote.textContent =
          "检测到本次作答速度较快或选项较为集中（质量分 " +
          quality.score +
          "），结果仅供参考。";
      } else {
        qualityNote.hidden = true;
      }
    }

    submitResult({
      version: QUIZ_VERSION,
      answers: answers.slice(),
      scores: scores,
      topType: top.key,
      intensity: level,
      durationMs: Date.now() - startTs,
      timings: timings.map(function (t) {
        return t === null ? null : Math.round(t / 10) * 10;
      }),
      quality: quality,
    });

    show("result");
  }

  /* =========================================================
     流程控制
     ========================================================= */
  function startQuiz() {
    idx = 0;
    locked = false;
    answers = new Array(QUESTIONS.length).fill(null);
    timings = new Array(QUESTIONS.length).fill(null);
    questionShownAt = 0;
    startTs = Date.now();
    show("quiz");
    renderQuestion();
  }

  startBtn.addEventListener("click", startQuiz);
  restartBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);

  document.addEventListener("keydown", function (e) {
    if (!screens.quiz.classList.contains("active")) return;

    const i = LETTERS.indexOf(e.key.toUpperCase());
    if (i !== -1 && i < QUESTIONS[idx].opts.length) {
      selectOption(i);
      return;
    }
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  });
})();
