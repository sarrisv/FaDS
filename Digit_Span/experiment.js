/* ************************************ */
/* Define helper functions */
/* ************************************ */
function evalAttentionChecks() {
  var check_percent = 1
  if (run_attention_checks) {
    var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
    var checks_passed = 0
    for (var i = 0; i < attention_check_trials.length; i++) {
      if (attention_check_trials[i].correct === true) {
        checks_passed += 1
      }
    }
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var arraysEqual = function(arr1, arr2) {
  if (arr1.length !== arr2.length)
    return false;
  for (var i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i])
      return false;
  }
  return true;
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var setStims = function() {
  curr_seq = []
  stim_array = []
  time_array = []
  var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  var last_num = 0
  for (var i = 0; i < num_digits; i++) {
    var num = randomDraw(nums.filter(function(x) {return Math.abs(x-last_num)>2}))
    last_num = num
    curr_seq.push(num)
    stim_array.push('<div class = centerbox><div class = digit-span-text>' + num.toString() +
      '</div></div>')
    time_array.push(stim_time)
  }
  total_time = num_digits * (stim_time + gap_time)
}

var getTestText = function() {
  return '<div class = centerbox><div class = center-text>' + num_digits + ' Digits</p></div>'
}

var getStims = function() {
  return stim_array
}

var getTimeArray = function() {
  return time_array
}

var getTotalTime = function() {
  return total_time
}

var getFeedback = function() {
  return '<div class = centerbox><div class = center-text>' + feedback + '</div></div>'
}

var recordClick = function(elm) {
  response.push(Number($(elm).text()))
  el_resp = document.getElementById('response_feedback')
  el_resp.innerHTML = response.join("")
}

var clearResponse = function() {
  response = []
  el_resp = document.getElementById('response_feedback')
  el_resp.innerHTML = response.join("")
}



/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var num_digits = 3
var num_trials = 14
var curr_seq = []
var stim_time = 800
var gap_time = 200
var time_array = []
var total_time = 0
var errors = 0
var error_lim = 3
var response = []
setStims()
var stim_array = getStims()

var response_grid =
  '<div class = numbox>' +
  '<div class = "numresponse" id = "response_feedback"></div>' +
  '<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>1</div></div></button>' +
  '<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>2</div></div></button>' +
  '<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>3</div></div></button>' +
  '<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>4</div></div></button>' +
  '<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>5</div></div></button>' +
  '<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>6</div></div></button>' +
  '<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>7</div></div></button>' +
  '<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>8</div></div></button>' +
  '<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>9</div></div></button>' +
  '<button class = clear_button id = "ClearButton" onclick = "clearResponse()">Clear</button>' +
  '<button class = submit_button id = "SubmitButton">Submit Answer</button></div>'

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: "attention_check"
  },
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take less than 10 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {
    trial_id: "instruction"
  },
  text: getInstructFeedback,
  timing_post_trial: 0
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: [
'<div class = centerbox><p class = block-text>In this game you will have to remember a set of numbers that will show up on the screen--one after the other. At the end of each round, enter all the numbers into the numberpad in the same order they were on the screen. Do your best to memorize the numbers, but do not write them down or use anything else to help you remember them.</p></div>'
 ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}

var pre_practice_instruction = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: [
  '<div class = centerbox><p class = block-text>You will now play a practice round.</p></div>'
],
  allow_keys:false,
  show_clickable_nav: true,
  timing_post_trial: 1000
}; 


var practice_trial = {
  type: 'single-stim-button',
  stimulus: response_grid,
  button_class: 'submit_button',
  data: {
    trial_id: "response",
    exp_stage: 'test'
  },
  on_finish: function() {
    var correct = false
    if (arraysEqual(response, curr_seq)) {
      feedback = '<span style="color:green">Correct!</span>'
      stims = setStims()
      correct = true
   } else {
      feedback = '<span style="color:red">Incorrect</span>'
      stims = setStims()
  }
    response = []
  },
  timing_post_trial: 500
}


var post_practice_instruction = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: [
  '<div class = centerbox><p class = block-text>You will now play the real game. The game will start after you click <strong>End Instructions</strong></p></div>'
],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};



var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'digit_span'
  },
  text: '<div class = centerbox><p class = center-block-text>Good job! You have finished this game! Please press the button on the table to alert the study team member.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


var start_test_block = {
  type: 'poldrack-single-stim',
  is_html: true,
  stimulus: getTestText,
  data: {
    trial_id: "test_intro"
  },
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 1000
};

var start_reverse_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "start_reverse"
  },
  text: '<div class = centerbox><p class = block-text>Now you will be playing a new version of the game. Instead of typing the numbers in the order they appeared on the screen, type them in the opposite order. For example, if 1-2-3 appeared on the screen, you would type 3-2-1 in the numberpad.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  on_finish: function() {
  	errors = 0
    num_digits = 3
    stims = setStims()
  }
}

/* define test block */
var test_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStims,
  is_html: true,
  timing_stim: getTimeArray,
  timing_gap: gap_time,
  choices: [
    ['none']
  ],
  data: {
    trial_id: "stim",
    exp_stage: 'test'
  },
  timing_response: getTotalTime,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      "sequence": curr_seq,
      "num_digits": num_digits
    })
  }
}


var forward_response_block = {
  type: 'single-stim-button',
  stimulus: response_grid,
  button_class: 'submit_button',
  data: {
    trial_id: "response",
    exp_stage: 'test'
  },
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      "response": response.slice(),
      "sequence": curr_seq,
      "num_digits": num_digits,
      "condition": "forward"
    })
    var correct = false
      // staircase
    if (arraysEqual(response, curr_seq)) {
      num_digits += 1
      feedback = '<span style="color:green">Correct!</span>'
      stims = setStims()
      correct = true
    } else {
      errors += 1
      if (num_digits > 1 && errors == 2) {
        num_digits -= 1
        errors = 0
      }
      feedback = '<span style="color:red">Incorrect</span>'
      stims = setStims()
    }
    jsPsych.data.addDataToLastTrial({
      correct: correct
    })
    response = []
  },
  timing_post_trial: 500
}

var reverse_response_block = {
  type: 'single-stim-button',
  stimulus: response_grid,
  button_class: 'submit_button',
  data: {
    trial_id: "response",
    exp_stage: 'test'
  },
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      "response": response.slice(),
      "sequence": curr_seq,
      "num_digits": num_digits,
      "condition": "reverse"
    })
    var correct = false
      // staircase
    if (arraysEqual(response.reverse(), curr_seq)) {
      num_digits += 1
      feedback = '<span style="color:green">Correct!</span>'
      stims = setStims()
      correct = true
    } else {
      errors += 1
      if (num_digits > 1 && errors == 2) {
        num_digits -= 1
        errors = 0
      }
      feedback = '<span style="color:red">Incorrect</span>'
      stims = setStims()
    }
    jsPsych.data.addDataToLastTrial({
      correct: correct
    })
    response = []
  },
  timing_post_trial: 500
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFeedback,
  data: {
    trial_id: "feedback"
  },
  is_html: true,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: true
}

/* create experiment definition array */
var digit_span_experiment = [];

digit_span_experiment.push(instruction_node);
digit_span_experiment.push(pre_practice_instruction);
digit_span_experiment.push(start_test_block);
digit_span_experiment.push(test_block);
digit_span_experiment.push(practice_trial);
digit_span_experiment.push(start_test_block);
digit_span_experiment.push(test_block);
digit_span_experiment.push(practice_trial);
digit_span_experiment.push(post_practice_instruction);
for (i = 0; i < num_trials ; i++ ) {
	digit_span_experiment.push(start_test_block)
	digit_span_experiment.push(test_block)
	digit_span_experiment.push(forward_response_block)
	digit_span_experiment.push(feedback_block)
}
digit_span_experiment.push(attention_node)
digit_span_experiment.push(start_reverse_block)
for (i = 0; i < num_trials ; i++ ) {
	digit_span_experiment.push(start_test_block)
	digit_span_experiment.push(test_block)
	digit_span_experiment.push(reverse_response_block)
	digit_span_experiment.push(feedback_block)
}
digit_span_experiment.push(post_task_block)
digit_span_experiment.push(end_block)

